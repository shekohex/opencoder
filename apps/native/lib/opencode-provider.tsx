import type { TypesGen } from "@coder/sdk";
import type { Event, OpencodeClient } from "@opencode-ai/sdk";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

import { useSession } from "@/lib/auth";
import { useWildcardAccessUrl } from "@/lib/deployment-config";
import {
	createGlobalEmitter,
	createTypedEmitter,
	type GlobalEmitter,
	type TypedEmitter,
} from "@/lib/event-emitter";
import { createCoderOpenCodeClient } from "@/lib/opencode-client";
import { isOpenCodeUrlError, resolveOpenCodeUrl } from "@/lib/workspace-apps";
import { useWorkspaces } from "@/lib/workspace-queries";

export type ConnectionStatus =
	| "disconnected"
	| "connecting"
	| "connected"
	| "error";

export interface WorkspaceConnection {
	workspaceId: string;
	client: OpencodeClient;
	baseUrl: string;
	status: ConnectionStatus;
	error?: string;
}

type WorkspaceEvent = Event;

export interface GlobalOpenCodeContextValue {
	connections: Map<string, WorkspaceConnection>;
	connect: (workspaceId: string) => Promise<void>;
	disconnect: (workspaceId: string) => void;
	getClient: (workspaceId: string) => OpencodeClient | undefined;
	getConnection: (workspaceId: string) => WorkspaceConnection | undefined;
	hasConnection: (workspaceId: string) => boolean;
	isConnecting: (workspaceId: string) => boolean;
	event: GlobalEmitter<WorkspaceEvent>;
}

const GlobalOpenCodeContext = createContext<GlobalOpenCodeContextValue | null>(
	null,
);

export function useGlobalOpenCode(): GlobalOpenCodeContextValue {
	const context = useContext(GlobalOpenCodeContext);
	if (!context) {
		throw new Error(
			"useGlobalOpenCode must be used within GlobalOpenCodeProvider",
		);
	}
	return context;
}

interface GlobalOpenCodeProviderProps {
	children: ReactNode;
}

type StreamEvent<T> = {
	id?: string;
	data: T;
};

function normalizeEventPayload(payload: unknown): Event | null {
	if (!payload || typeof payload !== "object") return null;

	const record = payload as Record<string, unknown>;
	if (typeof record.type === "string") {
		return record as Event;
	}

	const nestedPayload = record.payload;
	if (nestedPayload && typeof nestedPayload === "object") {
		const nestedRecord = nestedPayload as Record<string, unknown>;
		if (typeof nestedRecord.type === "string") {
			if (typeof record.directory === "string" && record.directory.length > 0) {
				const existingProperties =
					typeof nestedRecord.properties === "object" &&
					nestedRecord.properties !== null
						? (nestedRecord.properties as Record<string, unknown>)
						: null;
				const properties = {
					...(existingProperties ?? {}),
					directory: record.directory,
				};
				return { ...nestedRecord, properties } as Event;
			}
			return nestedRecord as Event;
		}
	}

	return null;
}

export function GlobalOpenCodeProvider({
	children,
}: GlobalOpenCodeProviderProps) {
	const { session } = useSession();
	const { baseUrl: coderBaseUrl } = useSession();
	const { data: workspaces } = useWorkspaces();
	const { wildcardAccessUrl } = useWildcardAccessUrl();

	const [connections, setConnections] = useState<
		Map<string, WorkspaceConnection>
	>(new Map());
	const eventRef = useRef(createGlobalEmitter<WorkspaceEvent>());
	const abortControllersRef = useRef<Map<string, AbortController>>(new Map());
	const connectingRef = useRef<Set<string>>(new Set());

	const getWorkspace = useCallback(
		(workspaceId: string): TypesGen.Workspace | undefined => {
			return workspaces?.find((ws) => ws.id === workspaceId);
		},
		[workspaces],
	);

	const updateConnection = useCallback(
		(workspaceId: string, update: Partial<WorkspaceConnection>) => {
			setConnections((prev) => {
				const existing = prev.get(workspaceId);
				if (!existing && !update.client) return prev;

				const next = new Map(prev);
				if (existing) {
					next.set(workspaceId, { ...existing, ...update });
				} else if (update.client) {
					next.set(workspaceId, {
						workspaceId,
						client: update.client,
						baseUrl: update.baseUrl ?? "",
						status: update.status ?? "disconnected",
						error: update.error,
					});
				}
				return next;
			});
		},
		[],
	);

	const _setupEventStream = useCallback(
		(workspaceId: string, client: OpencodeClient) => {
			const existingController = abortControllersRef.current.get(workspaceId);
			if (existingController) {
				existingController.abort();
			}

			const abortController = new AbortController();
			abortControllersRef.current.set(workspaceId, abortController);

			const MAX_RETRIES = 5;

			(async () => {
				const connectStream = async (attempt: number): Promise<void> => {
					if (abortController.signal.aborted) return;
					if (attempt >= MAX_RETRIES) {
						console.warn(
							`[OpenCode] SSE max retries (${MAX_RETRIES}) reached for workspace ${workspaceId}`,
						);
						return;
					}

					if (attempt > 0) {
						const delay = Math.min(3000 * 2 ** (attempt - 1), 30000);
						await new Promise((resolve) => setTimeout(resolve, delay));
						if (abortController.signal.aborted) return;
					}

					try {
						const subscribeOptions = {
							signal: abortController.signal,
							onSseEvent: (event: StreamEvent<unknown>) => {
								if (abortController.signal.aborted) return;
								const normalized = normalizeEventPayload(event.data);
								if (normalized) {
									eventRef.current.emit(workspaceId, normalized);
								}
							},
						};

						const result = await client.event.subscribe(subscribeOptions);

						for await (const _ of result.stream) {
							void _;
							if (abortController.signal.aborted) {
								break;
							}
						}
					} catch (error: unknown) {
						if (
							(error as Error)?.name === "AbortError" ||
							abortController.signal.aborted
						) {
							return;
						}
						console.warn(
							`[OpenCode] SSE error for workspace ${workspaceId} (attempt ${attempt + 1}/${MAX_RETRIES}):`,
							error,
						);
						await connectStream(attempt + 1);
						return;
					}

					if (!abortController.signal.aborted) {
						await connectStream(attempt + 1);
					}
				};

				await connectStream(0);
			})();
		},
		[],
	);

	const connect = useCallback(
		async (workspaceId: string): Promise<void> => {
			if (!session || !coderBaseUrl) {
				throw new Error("Not authenticated");
			}

			if (connectingRef.current.has(workspaceId)) {
				return;
			}

			const existing = connections.get(workspaceId);
			if (
				existing?.status === "connected" ||
				existing?.status === "connecting"
			) {
				return;
			}

			const workspace = getWorkspace(workspaceId);
			if (!workspace) {
				throw new Error(`Workspace ${workspaceId} not found`);
			}

			connectingRef.current.add(workspaceId);

			updateConnection(workspaceId, {
				status: "connecting",
				error: undefined,
				workspaceId,
			} as Partial<WorkspaceConnection>);

			try {
				const urlResult = resolveOpenCodeUrl(
					coderBaseUrl,
					workspace,
					wildcardAccessUrl,
				);

				if (isOpenCodeUrlError(urlResult)) {
					updateConnection(workspaceId, {
						status: "error",
						error: urlResult.message,
					});
					throw new Error(urlResult.message);
				}

				const client = createCoderOpenCodeClient({
					baseUrl: urlResult.baseUrl,
					sessionToken: session,
				});

				const healthResult = await client.config.get();
				if (!healthResult.data) {
					throw new Error("Health check failed");
				}

				updateConnection(workspaceId, {
					client,
					baseUrl: urlResult.baseUrl,
					status: "connected",
					error: undefined,
				});
			} catch (err) {
				const message =
					err instanceof Error ? err.message : "Connection failed";
				updateConnection(workspaceId, {
					status: "error",
					error: message,
				});
				throw err;
			} finally {
				connectingRef.current.delete(workspaceId);
			}
		},
		[
			session,
			coderBaseUrl,
			connections,
			getWorkspace,
			wildcardAccessUrl,
			updateConnection,
		],
	);

	const disconnect = useCallback((workspaceId: string) => {
		const controller = abortControllersRef.current.get(workspaceId);
		if (controller) {
			controller.abort();
			abortControllersRef.current.delete(workspaceId);
		}

		connectingRef.current.delete(workspaceId);

		setConnections((prev) => {
			const next = new Map(prev);
			next.delete(workspaceId);
			return next;
		});
	}, []);

	const getClient = useCallback(
		(workspaceId: string): OpencodeClient | undefined => {
			return connections.get(workspaceId)?.client;
		},
		[connections],
	);

	const getConnection = useCallback(
		(workspaceId: string): WorkspaceConnection | undefined => {
			return connections.get(workspaceId);
		},
		[connections],
	);

	const hasConnection = useCallback(
		(workspaceId: string): boolean => {
			const conn = connections.get(workspaceId);
			return conn?.status === "connected";
		},
		[connections],
	);

	const isConnecting = useCallback(
		(workspaceId: string): boolean => {
			return (
				connections.get(workspaceId)?.status === "connecting" ||
				connectingRef.current.has(workspaceId)
			);
		},
		[connections],
	);

	useEffect(() => {
		if (!workspaces) return;

		const runningWorkspaceIds = new Set(
			workspaces
				.filter((ws) => ws.latest_build?.status === "running")
				.map((ws) => ws.id),
		);

		for (const [workspaceId, connection] of connections) {
			if (
				!runningWorkspaceIds.has(workspaceId) &&
				connection.status !== "disconnected"
			) {
				disconnect(workspaceId);
			}
		}
	}, [workspaces, connections, disconnect]);

	useEffect(() => {
		return () => {
			for (const controller of abortControllersRef.current.values()) {
				controller.abort();
			}
			eventRef.current.clear();
		};
	}, []);

	const value = useMemo<GlobalOpenCodeContextValue>(
		() => ({
			connections,
			connect,
			disconnect,
			getClient,
			getConnection,
			hasConnection,
			isConnecting,
			event: eventRef.current,
		}),
		[
			connections,
			connect,
			disconnect,
			getClient,
			getConnection,
			hasConnection,
			isConnecting,
		],
	);

	return (
		<GlobalOpenCodeContext.Provider value={value}>
			{children}
		</GlobalOpenCodeContext.Provider>
	);
}

type EventTypeMap = {
	[K in Event["type"]]: Extract<Event, { type: K }>;
};

export interface WorkspaceSDKContextValue {
	workspaceId: string;
	client: OpencodeClient;
	baseUrl: string;
	status: ConnectionStatus;
	error?: string;
	event: TypedEmitter<EventTypeMap>;
}

const WorkspaceSDKContext = createContext<WorkspaceSDKContextValue | null>(
	null,
);

export function useWorkspaceSDK(): WorkspaceSDKContextValue {
	const context = useContext(WorkspaceSDKContext);
	if (!context) {
		throw new Error("useWorkspaceSDK must be used within WorkspaceSDKProvider");
	}
	return context;
}

export function useOptionalWorkspaceSDK(): WorkspaceSDKContextValue | null {
	return useContext(WorkspaceSDKContext);
}

interface WorkspaceSDKProviderProps {
	workspaceId: string;
	children: ReactNode;
	fallback?: ReactNode;
}

export function WorkspaceSDKProvider({
	workspaceId,
	children,
	fallback,
}: WorkspaceSDKProviderProps) {
	const globalOpenCode = useGlobalOpenCode();
	const [localEmitter] = useState(() => createTypedEmitter<EventTypeMap>());

	const connection = globalOpenCode.getConnection(workspaceId);

	useEffect(() => {
		if (
			!globalOpenCode.hasConnection(workspaceId) &&
			!globalOpenCode.isConnecting(workspaceId)
		) {
			globalOpenCode.connect(workspaceId).catch(() => {});
		}
	}, [workspaceId, globalOpenCode]);

	useEffect(() => {
		const unsubscribe = globalOpenCode.event.on(workspaceId, (event) => {
			localEmitter.emit(event.type, event as EventTypeMap[typeof event.type]);
		});

		return unsubscribe;
	}, [workspaceId, globalOpenCode.event, localEmitter]);

	useEffect(() => {
		return () => {
			localEmitter.clear();
		};
	}, [localEmitter]);

	if (!connection?.client) {
		if (fallback) {
			return <>{fallback}</>;
		}
		return null;
	}

	const value: WorkspaceSDKContextValue = {
		workspaceId,
		client: connection.client,
		baseUrl: connection.baseUrl,
		status: connection.status,
		error: connection.error,
		event: localEmitter,
	};

	return (
		<WorkspaceSDKContext.Provider value={value}>
			{children}
		</WorkspaceSDKContext.Provider>
	);
}

export function useOpenCodeConnection(workspaceId: string | null) {
	const globalOpenCode = useGlobalOpenCode();

	const connection = workspaceId
		? globalOpenCode.getConnection(workspaceId)
		: undefined;

	const connect = useCallback(async () => {
		if (!workspaceId) return;
		await globalOpenCode.connect(workspaceId);
	}, [workspaceId, globalOpenCode]);

	const disconnect = useCallback(() => {
		if (!workspaceId) return;
		globalOpenCode.disconnect(workspaceId);
	}, [workspaceId, globalOpenCode]);

	return {
		connection,
		client: connection?.client,
		status: connection?.status ?? "disconnected",
		error: connection?.error,
		isConnected: connection?.status === "connected",
		isConnecting: connection?.status === "connecting",
		connect,
		disconnect,
	};
}

export function useWorkspaceConnectionStatus(
	workspaceId: string | null,
): ConnectionStatus {
	const globalOpenCode = useGlobalOpenCode();
	if (!workspaceId) return "disconnected";
	return globalOpenCode.getConnection(workspaceId)?.status ?? "disconnected";
}

export function useConnectedWorkspaces(): string[] {
	const globalOpenCode = useGlobalOpenCode();
	return useMemo(() => {
		const connected: string[] = [];
		for (const [id, conn] of globalOpenCode.connections) {
			if (conn.status === "connected") {
				connected.push(id);
			}
		}
		return connected;
	}, [globalOpenCode.connections]);
}

export function useGlobalOpenCodeEvents() {
	const globalOpenCode = useGlobalOpenCode();
	return globalOpenCode.event;
}

export function useAttentionEvents(
	onAttention: (workspaceId: string, event: Event) => void,
) {
	const globalEvents = useGlobalOpenCodeEvents();

	useEffect(() => {
		const attentionTypes = new Set(["permission.asked", "session.error"]);

		const unsubscribe = globalEvents.listen((workspaceId, event) => {
			if (attentionTypes.has(event.type)) {
				onAttention(workspaceId, event);
			}
		});

		return unsubscribe;
	}, [globalEvents, onAttention]);
}
