import type { Session } from "@opencode-ai/sdk";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
	useOpenCodeConnection,
	useWorkspaceConnectionStatus,
} from "@/lib/opencode-provider";

export type SessionRowData = {
	id: string;
	name: string;
	status: string;
	lastUsed: string;
};

function formatSessionTime(time: {
	created: number;
	updated?: number;
}): string {
	const timestamp = time.updated ?? time.created;
	if (!timestamp) return "Unknown";

	const date = new Date(timestamp * 1000);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMinutes = Math.floor(diffMs / (1000 * 60));
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffMinutes < 1) return "just now";
	if (diffMinutes < 60) return `${diffMinutes}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;
	return `${diffDays}d ago`;
}

function getSessionStatus(session: Session): string {
	if (session.share) return "Shared";
	return "Active";
}

export function sessionToRowData(session: Session): SessionRowData {
	return {
		id: session.id,
		name: session.title || `Session ${session.id.slice(0, 8)}`,
		status: getSessionStatus(session),
		lastUsed: formatSessionTime(session.time),
	};
}

export const sessionsQueryKey = (
	workspaceId: string | null,
	directory?: string,
) => ["opencode-sessions", workspaceId, directory] as const;

export function useOpenCodeSessions(
	workspaceId: string | null,
	directory?: string,
) {
	const { client, isConnected } = useOpenCodeConnection(workspaceId);
	const connectionStatus = useWorkspaceConnectionStatus(workspaceId);

	const hasDirectory = !!directory;

	const query = useQuery({
		queryKey: sessionsQueryKey(workspaceId, directory),
		queryFn: async () => {
			if (!client) {
				throw new Error("OpenCode client not available");
			}
			if (!directory) {
				throw new Error("No directory selected");
			}

			const result = await client.session.list({ query: { directory } });
			return (result.data ?? []).map(sessionToRowData);
		},
		enabled: !!workspaceId && !!client && isConnected && hasDirectory,
		staleTime: 10 * 1000,
		gcTime: 5 * 60 * 1000,
	});

	return {
		sessions: query.data ?? [],
		isLoading: query.isLoading || connectionStatus === "connecting",
		isError: query.isError || connectionStatus === "error",
		error: query.error,
		refetch: query.refetch,
		connectionStatus,
		hasDirectory,
	};
}

export function useCreateSession(workspaceId: string | null) {
	const queryClient = useQueryClient();
	const { client, isConnected } = useOpenCodeConnection(workspaceId);

	return useMutation({
		mutationFn: async ({
			directory,
			title,
		}: {
			directory?: string;
			title?: string;
		}) => {
			if (!client) {
				throw new Error("OpenCode client not available");
			}
			if (!isConnected) {
				throw new Error("Not connected to OpenCode");
			}

			const result = await client.session.create({
				query: directory ? { directory } : undefined,
				body: { title },
			});

			if (!result.data) {
				throw new Error("Failed to create session");
			}

			return sessionToRowData(result.data);
		},
		onSuccess: (_newSession, variables) => {
			queryClient.invalidateQueries({
				queryKey: sessionsQueryKey(workspaceId, variables.directory),
			});
		},
	});
}
