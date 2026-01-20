import type { Message } from "@opencode-ai/sdk";
import { useQuery } from "@tanstack/react-query";
import type { MessageRole } from "@/domain/types";
import {
	useOpenCodeConnection,
	useWorkspaceConnectionStatus,
} from "@/lib/opencode-provider";

export type MessageRowData = {
	id: string;
	sessionID: string;
	role: MessageRole;
	parts: unknown[];
	time: { created: number; completed?: number };
	modelID?: string;
	error?: unknown;
};

export type { MessageRowData as ChatMessageData };

function flattenMessageRow(row: {
	info: Message;
	parts: unknown[];
}): MessageRowData {
	const info = row.info;
	return {
		id: info.id,
		sessionID: info.sessionID,
		role: info.role as MessageRole,
		parts: row.parts,
		time: info.time,
		modelID: "modelID" in info ? info.modelID : undefined,
		error: "error" in info ? info.error : undefined,
	};
}

export const messagesQueryKey = (
	workspaceId: string | null,
	sessionId: string | null,
) => ["messages", workspaceId, sessionId] as const;

export function useSessionMessages(
	workspaceId: string | null,
	sessionId: string | null,
) {
	const { client, isConnected } = useOpenCodeConnection(workspaceId);
	const connectionStatus = useWorkspaceConnectionStatus(workspaceId);

	const query = useQuery<MessageRowData[]>({
		queryKey: messagesQueryKey(workspaceId, sessionId),
		queryFn: async () => {
			if (!client) {
				throw new Error("OpenCode client not available");
			}
			if (!sessionId) {
				throw new Error("No session ID provided");
			}

			const result = await client.session.messages({
				path: { id: sessionId },
			});

			return (result.data ?? []).map(flattenMessageRow);
		},
		enabled: !!workspaceId && !!client && isConnected && !!sessionId,
		staleTime: 5 * 1000,
		gcTime: 2 * 60 * 1000,
		refetchInterval: (query) => {
			const data = query.state.data;
			if (!data) return false;
			const hasPending = data.some(
				(m: MessageRowData) => m.role === "assistant" && !m.time.completed,
			);
			return hasPending ? 2000 : false;
		},
	});

	return {
		messages: query.data ?? [],
		isLoading: query.isLoading || connectionStatus === "connecting",
		isError: query.isError || connectionStatus === "error",
		error: query.error,
		refetch: query.refetch,
	};
}

export function useSessionDetail(
	workspaceId: string | null,
	sessionId: string | null,
) {
	const { client, isConnected } = useOpenCodeConnection(workspaceId);
	const connectionStatus = useWorkspaceConnectionStatus(workspaceId);

	const query = useQuery({
		queryKey: ["session", sessionId],
		queryFn: async () => {
			if (!client) {
				throw new Error("OpenCode client not available");
			}
			if (!sessionId) {
				throw new Error("No session ID provided");
			}

			const result = await client.session.get({
				path: { id: sessionId },
			});

			return result.data;
		},
		enabled: !!workspaceId && !!client && isConnected && !!sessionId,
		staleTime: 10 * 1000,
		gcTime: 5 * 60 * 1000,
	});

	return {
		session: query.data,
		isLoading: query.isLoading || connectionStatus === "connecting",
		isError: query.isError || connectionStatus === "error",
		error: query.error,
	};
}
