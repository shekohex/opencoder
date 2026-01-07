import { TypesGen } from "@coder/sdk";
import {
	createOpencodeClient as createSdkClient,
	type OpencodeClient,
} from "@opencode-ai/sdk";

export const SessionTokenHeader = TypesGen.SessionTokenHeader;

export interface CoderOpenCodeClientConfig {
	baseUrl: string;
	sessionToken: string;
}

export function createCoderOpenCodeClient(
	config: CoderOpenCodeClientConfig,
): OpencodeClient {
	const { baseUrl, sessionToken } = config;
	const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");

	const fetchWithCoderAuth: typeof globalThis.fetch = async (input, init) => {
		const headers = new Headers(init?.headers);
		if (!headers.has(SessionTokenHeader)) {
			headers.set(SessionTokenHeader, sessionToken);
		}

		return globalThis.fetch(input, {
			...init,
			headers,
		});
	};

	return createSdkClient({
		baseUrl: normalizedBaseUrl,
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
