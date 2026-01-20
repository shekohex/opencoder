import type { Session, Todo } from "@opencode-ai/sdk";
import { useQuery } from "@tanstack/react-query";
import {
	useOpenCodeConnection,
	useWorkspaceConnectionStatus,
} from "@/lib/opencode-provider";

export const sessionListQueryKey = (workspaceId: string | null) =>
	["sessions", workspaceId] as const;

export const sessionChildrenQueryKey = (sessionId: string | null) =>
	["session-children", sessionId] as const;

export const sessionTodoQueryKey = (sessionId: string | null) =>
	["session-todo", sessionId] as const;

export const sessionStatusQueryKey = (workspaceId: string | null) =>
	["session-status", workspaceId] as const;

export function useSessionList(workspaceId: string | null, directory?: string) {
	const { client, isConnected } = useOpenCodeConnection(workspaceId);
	const connectionStatus = useWorkspaceConnectionStatus(workspaceId);

	const query = useQuery<Session[]>({
		queryKey: sessionListQueryKey(workspaceId),
		queryFn: async () => {
			if (!client) {
				throw new Error("OpenCode client not available");
			}

			const result = await client.session.list({
				query: directory ? { directory } : undefined,
			});

			return result.data ?? [];
		},
		enabled: !!workspaceId && !!client && isConnected,
		staleTime: 10 * 1000,
		gcTime: 5 * 60 * 1000,
	});

	return {
		sessions: query.data ?? [],
		isLoading: query.isLoading || connectionStatus === "connecting",
		isError: query.isError || connectionStatus === "error",
		error: query.error,
		refetch: query.refetch,
	};
}

export function useSessionChildren(sessionId: string | null) {
	const { client, isConnected } = useOpenCodeConnection(null);
	const connectionStatus = useWorkspaceConnectionStatus(null);

	const query = useQuery<Session[]>({
		queryKey: sessionChildrenQueryKey(sessionId),
		queryFn: async () => {
			if (!client) {
				throw new Error("OpenCode client not available");
			}
			if (!sessionId) {
				throw new Error("No session ID provided");
			}

			const result = await client.session.children({
				path: { id: sessionId },
			});

			return result.data ?? [];
		},
		enabled: !!client && isConnected && !!sessionId,
		staleTime: 10 * 1000,
		gcTime: 5 * 60 * 1000,
	});

	return {
		children: query.data ?? [],
		isLoading: query.isLoading || connectionStatus === "connecting",
		isError: query.isError || connectionStatus === "error",
		error: query.error,
		refetch: query.refetch,
	};
}

export function useSessionTodo(sessionId: string | null) {
	const { client, isConnected } = useOpenCodeConnection(null);
	const connectionStatus = useWorkspaceConnectionStatus(null);

	const query = useQuery<Todo[]>({
		queryKey: sessionTodoQueryKey(sessionId),
		queryFn: async () => {
			if (!client) {
				throw new Error("OpenCode client not available");
			}
			if (!sessionId) {
				throw new Error("No session ID provided");
			}

			const result = await client.session.todo({
				path: { id: sessionId },
			});

			return result.data ?? [];
		},
		enabled: !!client && isConnected && !!sessionId,
		staleTime: 5 * 1000,
		gcTime: 2 * 60 * 1000,
		refetchInterval: (query) => {
			const data = query.state.data;
			if (!data) return false;
			const hasPending = data.some(
				(t) => t.status === "in_progress" || t.status === "pending",
			);
			return hasPending ? 3000 : false;
		},
	});

	return {
		todos: query.data ?? [],
		isLoading: query.isLoading || connectionStatus === "connecting",
		isError: query.isError || connectionStatus === "error",
		error: query.error,
		refetch: query.refetch,
	};
}

export type SessionStatusMap = Record<
	string,
	{ type: "idle" | "busy" | "retry" }
>;

export function useSessionStatus(workspaceId: string | null) {
	const { client, isConnected } = useOpenCodeConnection(workspaceId);
	const connectionStatus = useWorkspaceConnectionStatus(workspaceId);

	const query = useQuery<SessionStatusMap>({
		queryKey: sessionStatusQueryKey(workspaceId),
		queryFn: async () => {
			if (!client) {
				throw new Error("OpenCode client not available");
			}

			const result = await client.session.status(undefined);

			return result.data ?? {};
		},
		enabled: !!workspaceId && !!client && isConnected,
		staleTime: 5 * 1000,
		gcTime: 2 * 60 * 1000,
		refetchInterval: 5000,
	});

	return {
		statusMap: query.data ?? {},
		isLoading: query.isLoading || connectionStatus === "connecting",
		isError: query.isError || connectionStatus === "error",
		error: query.error,
		refetch: query.refetch,
	};
}

export type TodoStatus = Todo["status"];
export type TodoPriority = Todo["priority"];

export function isTodoPending(todo: Todo): boolean {
	return todo.status === "pending";
}

export function isTodoInProgress(todo: Todo): boolean {
	return todo.status === "in_progress";
}

export function isTodoCompleted(todo: Todo): boolean {
	return todo.status === "completed";
}

export function isTodoCancelled(todo: Todo): boolean {
	return todo.status === "cancelled";
}
