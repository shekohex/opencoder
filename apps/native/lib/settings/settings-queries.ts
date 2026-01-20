import type { McpStatus, Provider } from "@opencode-ai/sdk";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useGlobalOpenCode } from "@/lib/opencode-provider";

export function useProviders(workspaceId: string) {
	const { getClient } = useGlobalOpenCode();
	const client = getClient(workspaceId);

	return useQuery<Provider[]>({
		queryKey: ["providers", workspaceId],
		queryFn: async () => {
			if (!client) throw new Error("No client connected");
			const response = await client.config.providers();
			if (response.error) throw new Error(String(response.error));
			const data = response.data as { providers?: Provider[] };
			return data.providers ?? [];
		},
		enabled: !!client,
	});
}

export function useProviderAuthMethods(workspaceId: string) {
	const { getClient } = useGlobalOpenCode();
	const client = getClient(workspaceId);

	return useQuery<Record<string, unknown[]>>({
		queryKey: ["provider-auth", workspaceId],
		queryFn: async () => {
			if (!client) throw new Error("No client connected");
			const response = await client.provider.auth();
			if (response.error) throw new Error(String(response.error));
			return response.data as Record<string, unknown[]>;
		},
		enabled: !!client,
	});
}

export function useAvailableProviders(workspaceId: string) {
	const { getClient } = useGlobalOpenCode();
	const client = getClient(workspaceId);

	return useQuery<Array<{ id: string; name?: string }>>({
		queryKey: ["available-providers", workspaceId],
		queryFn: async () => {
			if (!client) throw new Error("No client connected");
			const response = await client.provider.list();
			if (response.error) throw new Error(String(response.error));
			const payload = response.data as
				| { all?: unknown[]; providers?: unknown[] }
				| unknown[];
			const entries = Array.isArray(payload)
				? payload
				: ((payload as { all?: unknown[] }).all ??
					(payload as { providers?: unknown[] }).providers ??
					[]);
			return entries.map((entry: unknown) => {
				if (typeof entry === "string") return { id: entry };
				if (typeof entry === "object" && entry !== null) {
					const record = entry as Record<string, unknown>;
					const id =
						(typeof record.id === "string" && record.id) ||
						(typeof record.providerID === "string" && record.providerID) ||
						(typeof record.slug === "string" && record.slug) ||
						(typeof record.name === "string" && record.name) ||
						"";
					return {
						id,
						name: typeof record.name === "string" ? record.name : undefined,
					};
				}
				return { id: String(entry) };
			});
		},
		enabled: !!client,
	});
}

export function useSaveApiKey() {
	const { getClient } = useGlobalOpenCode();

	return useMutation({
		mutationFn: async ({
			workspaceId,
			providerId,
			apiKey,
		}: {
			workspaceId: string;
			providerId: string;
			apiKey: string;
		}) => {
			const client = getClient(workspaceId);
			if (!client) throw new Error("No client connected");

			const response = await client.auth.set({
				path: { id: providerId },
				body: { type: "api", key: apiKey },
			});
			if (response.error) throw new Error(String(response.error));
			return response.data;
		},
	});
}

export function useDisconnectProvider() {
	const { getClient } = useGlobalOpenCode();

	return useMutation({
		mutationFn: async ({
			workspaceId,
			providerId,
		}: {
			workspaceId: string;
			providerId: string;
		}) => {
			const client = getClient(workspaceId);
			if (!client) throw new Error("No client connected");

			const response = await client.auth.remove({
				path: { name: providerId },
			});
			if (response.error) throw new Error(String(response.error));
			return response.data;
		},
	});
}

export function useMcpStatus(workspaceId: string) {
	const { getClient } = useGlobalOpenCode();
	const client = getClient(workspaceId);

	return useQuery<Record<string, McpStatus>>({
		queryKey: ["mcp-status", workspaceId],
		queryFn: async () => {
			if (!client) throw new Error("No client connected");
			const response = await client.mcp.status();
			if (response.error) throw new Error(String(response.error));
			return response.data as Record<string, McpStatus>;
		},
		enabled: !!client,
	});
}

export function useMcpConnect() {
	const { getClient } = useGlobalOpenCode();

	return useMutation({
		mutationFn: async ({
			workspaceId,
			name,
		}: {
			workspaceId: string;
			name: string;
		}) => {
			const client = getClient(workspaceId);
			if (!client) throw new Error("No client connected");

			const response = await client.mcp.connect({ path: { name } });
			if (response.error) throw new Error(String(response.error));
			return response.data;
		},
	});
}

export function useMcpDisconnect() {
	const { getClient } = useGlobalOpenCode();

	return useMutation({
		mutationFn: async ({
			workspaceId,
			name,
		}: {
			workspaceId: string;
			name: string;
		}) => {
			const client = getClient(workspaceId);
			if (!client) throw new Error("No client connected");

			const response = await client.mcp.disconnect({ path: { name } });
			if (response.error) throw new Error(String(response.error));
			return response.data;
		},
	});
}
