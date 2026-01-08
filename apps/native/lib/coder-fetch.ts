import { TypesGen } from "@coder/sdk";
import { Platform } from "react-native";

const PROXY_TARGET_HEADER = "X-Proxy-Target";
const SESSION_TOKEN_HEADER = TypesGen.SessionTokenHeader;

export interface CoderFetchOptions extends Omit<RequestInit, "headers"> {
	headers?: Record<string, string>;
}

export function createCoderFetch(baseUrl: string, sessionToken: string) {
	const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
	const useProxy = Platform.OS === "web";

	return async function coderFetch(
		path: string,
		options: CoderFetchOptions = {},
	): Promise<Response> {
		const url = useProxy
			? path.startsWith("/")
				? path
				: `/${path}`
			: `${normalizedBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;

		const headers: Record<string, string> = {
			Accept: "application/json",
			[SESSION_TOKEN_HEADER]: sessionToken,
			...options.headers,
		};

		if (useProxy) {
			headers[PROXY_TARGET_HEADER] = normalizedBaseUrl;
		}

		return fetch(url, {
			...options,
			headers,
		});
	};
}

export async function coderFetchJson<T>(
	baseUrl: string,
	sessionToken: string,
	path: string,
	options: CoderFetchOptions = {},
): Promise<T> {
	const fetcher = createCoderFetch(baseUrl, sessionToken);
	const response = await fetcher(path, options);

	if (!response.ok) {
		throw new Error(
			`Coder API error: ${response.status} ${response.statusText}`,
		);
	}

	return response.json();
}
