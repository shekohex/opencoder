import { StatusError } from "expo-server";

const PROXY_TARGET_HEADER = "X-Proxy-Target";

export async function GET(
	request: Request,
	params: { path: string },
): Promise<Response> {
	return handleProxy(request, params);
}

export async function POST(
	request: Request,
	params: { path: string },
): Promise<Response> {
	return handleProxy(request, params);
}

export async function PUT(
	request: Request,
	params: { path: string },
): Promise<Response> {
	return handleProxy(request, params);
}

export async function PATCH(
	request: Request,
	params: { path: string },
): Promise<Response> {
	return handleProxy(request, params);
}

export async function DELETE(
	request: Request,
	params: { path: string },
): Promise<Response> {
	return handleProxy(request, params);
}

async function handleProxy(
	request: Request,
	params: { path: string },
): Promise<Response> {
	const targetUrl = request.headers.get(PROXY_TARGET_HEADER);
	if (!targetUrl) {
		throw new StatusError(
			503,
			"Proxy target not specified. Include X-Proxy-Target header.",
		);
	}

	const path = `/api/v2/${params.path}`;
	const url = new URL(request.url);
	const proxyUrl = targetUrl + path + url.search;

	const headers = new Headers();
	for (const [key, value] of request.headers.entries()) {
		const lowerKey = key.toLowerCase();
		if (
			lowerKey !== "host" &&
			lowerKey !== "origin" &&
			lowerKey !== "referer" &&
			lowerKey !== PROXY_TARGET_HEADER.toLowerCase()
		) {
			headers.set(key, value);
		}
	}

	let body: BodyInit | null = null;
	if (request.method !== "GET" && request.method !== "HEAD") {
		body = await request.text();
	}

	const response = await fetch(proxyUrl, {
		method: request.method,
		headers,
		body,
	});

	const responseHeaders = new Headers(response.headers);
	responseHeaders.delete("access-control-allow-origin");
	responseHeaders.delete("access-control-allow-methods");
	responseHeaders.delete("access-control-allow-headers");

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: responseHeaders,
	});
}
