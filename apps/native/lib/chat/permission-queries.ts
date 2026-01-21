import type { OpencodeClient } from "@opencode-ai/sdk";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Permission } from "@/domain/types";
import { assertClient } from "@/lib/opencode-provider";

export type PermissionReply = "once" | "always" | "reject";

interface PermissionListResponse {
	data: Permission[];
}

interface PermissionResponse {
	data: {
		success: boolean;
	};
}

interface PermissionNamespace {
	list: (args: {
		path: { sessionId: string };
	}) => Promise<PermissionListResponse>;
	respond: (args: {
		path: { sessionId: string; requestId: string };
		body: { reply?: PermissionReply; answers?: string[][] };
	}) => Promise<PermissionResponse>;
}

interface ExtendedOpencodeClient extends OpencodeClient {
	permission?: PermissionNamespace;
}

export function usePendingPermissions(
	client: OpencodeClient | null,
	sessionId: string,
) {
	const isEnabled =
		!!client && !!sessionId && !!(client as ExtendedOpencodeClient).permission;

	const query = useQuery<Permission[]>({
		queryKey: ["permissions", sessionId],
		queryFn: async () => {
			assertClient(client);

			const extendedClient = client as ExtendedOpencodeClient;
			if (!extendedClient.permission) {
				return [];
			}

			const result = await extendedClient.permission.list({
				path: { sessionId },
			});

			return result.data ?? [];
		},
		enabled: isEnabled,
		staleTime: 2 * 1000,
		gcTime: 60 * 1000,
		refetchInterval: isEnabled ? 2000 : false,
	});

	return {
		permissions: query.data ?? [],
		isLoading: query.isLoading,
		isError: query.isError,
		error: query.error,
	};
}

export function useRespondToPermission(client: OpencodeClient | null) {
	const mutation = useMutation({
		mutationFn: async ({
			sessionId,
			requestId,
			reply,
		}: {
			sessionId: string;
			requestId: string;
			reply: PermissionReply;
		}) => {
			assertClient(client);

			const extendedClient = client as ExtendedOpencodeClient;
			if (!extendedClient.permission) {
				throw new Error("Permission API not available");
			}

			const result = await extendedClient.permission.respond({
				path: { sessionId, requestId },
				body: { reply },
			});

			return result.data;
		},
	});

	const respondToPermission = async (
		sessionId: string,
		requestId: string,
		reply: PermissionReply,
	) => mutation.mutateAsync({ sessionId, requestId, reply });

	return {
		respondToPermission,
		isPending: mutation.isPending,
	};
}

export function usePendingQuestions(
	client: OpencodeClient | null,
	sessionId: string,
) {
	const isEnabled =
		!!client && !!sessionId && !!(client as ExtendedOpencodeClient).permission;

	const query = useQuery<Permission[]>({
		queryKey: ["questions", sessionId],
		queryFn: async () => {
			assertClient(client);

			const extendedClient = client as ExtendedOpencodeClient;
			if (!extendedClient.permission) {
				return [];
			}

			const result = await extendedClient.permission.list({
				path: { sessionId },
			});

			return (result.data ?? []).filter(
				(p: Permission) => p.type === "question",
			);
		},
		enabled: isEnabled,
		staleTime: 2 * 1000,
		gcTime: 60 * 1000,
		refetchInterval: isEnabled ? 2000 : false,
	});

	return {
		questions: query.data ?? [],
		isLoading: query.isLoading,
		isError: query.isError,
		error: query.error,
	};
}

export function useRespondToQuestion(client: OpencodeClient | null) {
	const mutation = useMutation({
		mutationFn: async ({
			sessionId,
			requestId,
			answers,
		}: {
			sessionId: string;
			requestId: string;
			answers: string[][];
		}) => {
			assertClient(client);

			const extendedClient = client as ExtendedOpencodeClient;
			if (!extendedClient.permission) {
				throw new Error("Permission API not available");
			}

			const result = await extendedClient.permission.respond({
				path: { sessionId, requestId },
				body: { answers },
			});

			return result.data;
		},
	});

	const respondToQuestion = async (
		sessionId: string,
		requestId: string,
		answers: string[][],
	) => mutation.mutateAsync({ sessionId, requestId, answers });

	return {
		respondToQuestion,
		isPending: mutation.isPending,
	};
}
