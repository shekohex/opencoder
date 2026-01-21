import type { OpencodeClient, Pty } from "@opencode-ai/sdk";
import { useMutation, useQuery } from "@tanstack/react-query";

import { assertClient } from "@/lib/opencode-provider";

export const terminalKeys = {
	list: (workspaceId: string, directory: string) =>
		["terminal", "list", workspaceId, directory] as const,
};

export function useTerminalList(
	client: OpencodeClient | null,
	workspaceId: string,
	directory: string,
) {
	return useQuery<Pty[]>({
		queryKey: terminalKeys.list(workspaceId, directory),
		queryFn: async () => {
			assertClient(client);

			const result = await client.pty.list({
				query: { directory },
			});

			return result.data ?? [];
		},
		enabled: !!client,
		staleTime: 5 * 1000,
		gcTime: 2 * 60 * 1000,
	});
}

export function useTerminalCreate(client: OpencodeClient | null) {
	const mutation = useMutation({
		mutationFn: async ({
			cwd,
			command,
			args,
			title,
		}: {
			cwd: string;
			command: string;
			args: string[];
			title?: string;
		}) => {
			assertClient(client);

			const result = await client.pty.create({
				body: { command, args, cwd, title },
			});

			return result.data;
		},
	});

	return mutation;
}

export function useTerminalResize(client: OpencodeClient | null) {
	const mutation = useMutation({
		mutationFn: async ({
			ptyId,
			rows,
			cols,
		}: {
			ptyId: string;
			rows: number;
			cols: number;
		}) => {
			assertClient(client);

			const result = await client.pty.update({
				body: { size: { rows, cols } },
				path: { id: ptyId },
			});

			return result.data;
		},
	});

	return mutation;
}

export function useTerminalDelete(client: OpencodeClient | null) {
	const mutation = useMutation({
		mutationFn: async ({ ptyId }: { ptyId: string }) => {
			assertClient(client);

			await client.pty.remove({
				path: { id: ptyId },
			});
		},
	});

	return mutation;
}

export function useTerminalConnect(client: OpencodeClient | null) {
	const mutation = useMutation({
		mutationFn: async ({ ptyId }: { ptyId: string }) => {
			assertClient(client);

			const result = await client.pty.connect({
				path: { id: ptyId },
			});

			return result.data;
		},
	});

	return mutation;
}
