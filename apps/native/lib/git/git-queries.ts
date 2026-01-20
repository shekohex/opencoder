import type { OpencodeClient, Pty } from "@opencode-ai/sdk";
import { useMutation, useQuery } from "@tanstack/react-query";

export interface GitStatus {
	branch: string;
	ahead: number;
	behind: number;
	files: Array<{
		path: string;
		status: "modified" | "added" | "deleted" | "renamed";
	}>;
}

export interface GitIdentity {
	name: string;
	email: string;
}

export const gitKeys = {
	status: (workspaceId: string, directory: string) =>
		["git", "status", workspaceId, directory] as const,
	identity: (workspaceId: string, directory: string) =>
		["git", "identity", workspaceId, directory] as const,
};

export function useGitStatus(
	client: OpencodeClient | null,
	workspaceId: string,
	directory: string,
) {
	return useQuery<Pty>({
		queryKey: gitKeys.status(workspaceId, directory),
		queryFn: async () => {
			if (!client) {
				throw new Error("OpenCode client not available");
			}

			const result = await client.pty.create({
				body: {
					command: "git",
					args: ["status", "--porcelain", "--branch"],
					cwd: directory,
				},
			});

			if (!result.data) {
				throw new Error("Failed to create PTY");
			}

			return result.data;
		},
		enabled: !!client,
		staleTime: 10 * 1000,
		gcTime: 2 * 60 * 1000,
	});
}

export function useGitIdentity(
	client: OpencodeClient | null,
	workspaceId: string,
	directory: string,
) {
	return useQuery<Pty>({
		queryKey: gitKeys.identity(workspaceId, directory),
		queryFn: async () => {
			if (!client) {
				throw new Error("OpenCode client not available");
			}

			const result = await client.pty.create({
				body: {
					command: "git",
					args: ["config", "--get-regexp", "^user\\.(name|email)$"],
					cwd: directory,
				},
			});

			if (!result.data) {
				throw new Error("Failed to create PTY");
			}

			return result.data;
		},
		enabled: !!client,
		staleTime: 60 * 1000,
		gcTime: 10 * 60 * 1000,
	});
}

export function useGitCommit(client: OpencodeClient | null) {
	const mutation = useMutation({
		mutationFn: async ({
			directory,
			message,
		}: {
			directory: string;
			message: string;
		}) => {
			if (!client) {
				throw new Error("OpenCode client not available");
			}

			const result = await client.pty.create({
				body: {
					command: "git",
					args: ["commit", "-m", message],
					cwd: directory,
				},
			});

			return result.data;
		},
	});

	return mutation;
}

export function useGitPush(client: OpencodeClient | null) {
	const mutation = useMutation({
		mutationFn: async ({ directory }: { directory: string }) => {
			if (!client) {
				throw new Error("OpenCode client not available");
			}

			const result = await client.pty.create({
				body: {
					command: "git",
					args: ["push"],
					cwd: directory,
				},
			});

			return result.data;
		},
	});

	return mutation;
}

export function useGitPull(client: OpencodeClient | null) {
	const mutation = useMutation({
		mutationFn: async ({ directory }: { directory: string }) => {
			if (!client) {
				throw new Error("OpenCode client not available");
			}

			const result = await client.pty.create({
				body: {
					command: "git",
					args: ["pull"],
					cwd: directory,
				},
			});

			return result.data;
		},
	});

	return mutation;
}

export function useGitAdd(client: OpencodeClient | null) {
	const mutation = useMutation({
		mutationFn: async ({
			directory,
			paths,
		}: {
			directory: string;
			paths: string[];
		}) => {
			if (!client) {
				throw new Error("OpenCode client not available");
			}

			const result = await client.pty.create({
				body: {
					command: "git",
					args: ["add", ...paths],
					cwd: directory,
				},
			});

			return result.data;
		},
	});

	return mutation;
}

export function useGitCreateBranch(client: OpencodeClient | null) {
	const mutation = useMutation({
		mutationFn: async ({
			directory,
			name,
		}: {
			directory: string;
			name: string;
		}) => {
			if (!client) {
				throw new Error("OpenCode client not available");
			}

			const result = await client.pty.create({
				body: {
					command: "git",
					args: ["checkout", "-b", name],
					cwd: directory,
				},
			});

			return result.data;
		},
	});

	return mutation;
}

export function useGitSetIdentity(client: OpencodeClient | null) {
	const mutation = useMutation({
		mutationFn: async ({
			directory,
			name,
			email,
		}: {
			directory: string;
			name: string;
			email: string;
		}) => {
			if (!client) {
				throw new Error("OpenCode client not available");
			}

			await client.pty.create({
				body: {
					command: "git",
					args: ["config", "user.name", name],
					cwd: directory,
				},
			});

			await client.pty.create({
				body: {
					command: "git",
					args: ["config", "user.email", email],
					cwd: directory,
				},
			});

			return { name, email };
		},
	});

	return mutation;
}
