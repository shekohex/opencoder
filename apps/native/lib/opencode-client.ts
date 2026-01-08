import { TypesGen } from "@coder/sdk";
import {
	createOpencodeClient as createSdkClient,
	type OpencodeClient,
} from "@opencode-ai/sdk";
import { Platform } from "react-native";

export const SessionTokenHeader = TypesGen.SessionTokenHeader;
const PROXY_TARGET_HEADER = "X-Proxy-Target";

export interface CoderOpenCodeClientConfig {
	baseUrl: string;
	sessionToken: string;
}

export function createCoderOpenCodeClient(
	config: CoderOpenCodeClientConfig,
): OpencodeClient {
	const { baseUrl, sessionToken } = config;
	const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");

	const useProxy = Platform.OS === "web";
	const clientBaseUrl = useProxy ? "/api/opencode" : normalizedBaseUrl;

	const fetchWithCoderAuth: typeof globalThis.fetch = async (input, init) => {
		const headers = new Headers(init?.headers);
		if (!headers.has(SessionTokenHeader)) {
			headers.set(SessionTokenHeader, sessionToken);
		}
		if (useProxy) {
			headers.set(PROXY_TARGET_HEADER, normalizedBaseUrl);
		}

		return globalThis.fetch(input, {
			...init,
			headers,
		});
	};

	return createSdkClient({
		baseUrl: clientBaseUrl,
		fetch: fetchWithCoderAuth,
	});
}

export async function checkOpenCodeHealth(
	client: OpencodeClient,
): Promise<boolean> {
	try {
		const result = await client.config.get();
		return result.data !== undefined;
	} catch {
		return false;
	}
}

export async function listOpenCodeProjects(client: OpencodeClient) {
	const result = await client.project.list();
	return result.data ?? [];
}

export async function listOpenCodeSessions(
	client: OpencodeClient,
	directory?: string,
) {
	const result = await client.session.list(
		directory ? { query: { directory } } : undefined,
	);
	return result.data ?? [];
}

export async function createOpenCodeSession(
	client: OpencodeClient,
	options?: { directory?: string; title?: string; parentID?: string },
) {
	const result = await client.session.create({
		query: options?.directory ? { directory: options.directory } : undefined,
		body: {
			parentID: options?.parentID,
			title: options?.title,
		},
	});
	if (!result.data) {
		throw new Error("Failed to create session");
	}
	return result.data;
}

export type { OpencodeClient };
