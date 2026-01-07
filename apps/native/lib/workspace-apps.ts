import type { TypesGen } from "@coder/sdk";

export const OPENCODE_APP_SLUG = "opencode";
export const OPENCODE_DEFAULT_PORT = 4096;

export interface OpenCodeAppInfo {
	app: TypesGen.WorkspaceApp;
	agent: TypesGen.WorkspaceAgent;
	resource: TypesGen.WorkspaceResource;
}

export interface ResolveOpencodeAppUrlParams {
	baseUrl: string;
	app: TypesGen.WorkspaceApp;
	agentName: string;
	ownerName: string;
	workspaceName: string;
	wildcardHostname?: string | null;
	pathAppUrl?: string | null;
}

function extractPortFromUrl(url: string | undefined): number | null {
	if (!url) return null;
	try {
		const parsed = new URL(url, "http://localhost");
		const port = Number.parseInt(parsed.port, 10);
		return Number.isNaN(port) ? null : port;
	} catch {
		const portMatch = url.match(/:(\d+)/);
		if (portMatch) {
			return Number.parseInt(portMatch[1], 10);
		}
		return null;
	}
}

export function findOpenCodeApp(
	workspace: TypesGen.Workspace,
): OpenCodeAppInfo | null {
	const resources = workspace.latest_build?.resources;
	if (!resources || resources.length === 0) {
		return null;
	}

	for (const resource of resources) {
		const agents = resource.agents;
		if (!agents || agents.length === 0) {
			continue;
		}

		for (const agent of agents) {
			const apps = agent.apps;
			if (!apps || apps.length === 0) {
				continue;
			}

			const appBySlug = apps.find(
				(app) => app.slug.toLowerCase() === OPENCODE_APP_SLUG,
			);
			if (appBySlug) {
				return { app: appBySlug, agent, resource };
			}

			const appByPort = apps.find((app) => {
				const port = extractPortFromUrl(app.url);
				return port === OPENCODE_DEFAULT_PORT;
			});
			if (appByPort) {
				return { app: appByPort, agent, resource };
			}
		}
	}

	return null;
}

export function resolveOpencodeAppUrl(
	params: ResolveOpencodeAppUrlParams,
): string {
	const {
		baseUrl,
		app,
		agentName,
		ownerName,
		workspaceName,
		wildcardHostname,
		pathAppUrl,
	} = params;

	if (app.subdomain && app.subdomain_name && wildcardHostname) {
		const host = wildcardHostname.replace("*", app.subdomain_name);
		const protocol = baseUrl.startsWith("https") ? "https" : "http";
		return `${protocol}://${host}/`;
	}

	const base = (pathAppUrl || baseUrl).replace(/\/+$/, "");
	return `${base}/@${ownerName}/${workspaceName}.${agentName}/apps/${encodeURIComponent(app.slug)}/`;
}

export interface OpenCodeUrlResult {
	baseUrl: string;
	appInfo: OpenCodeAppInfo;
}

export interface OpenCodeUrlError {
	type: "no_resources" | "no_agents" | "no_app" | "workspace_not_running";
	message: string;
}

export function resolveOpenCodeUrl(
	coderBaseUrl: string,
	workspace: TypesGen.Workspace,
	wildcardHostname?: string | null,
): OpenCodeUrlResult | OpenCodeUrlError {
	const status = workspace.latest_build?.status;
	if (status !== "running") {
		return {
			type: "workspace_not_running",
			message: `Workspace is ${status || "unknown"}, must be running to access OpenCode`,
		};
	}

	const resources = workspace.latest_build?.resources;
	if (!resources || resources.length === 0) {
		return {
			type: "no_resources",
			message: "Workspace has no resources",
		};
	}

	const hasAgents = resources.some((r) => r.agents && r.agents.length > 0);
	if (!hasAgents) {
		return {
			type: "no_agents",
			message: "Workspace has no agents",
		};
	}

	const appInfo = findOpenCodeApp(workspace);
	if (!appInfo) {
		return {
			type: "no_app",
			message: `OpenCode app not found (expected slug "${OPENCODE_APP_SLUG}" or port ${OPENCODE_DEFAULT_PORT})`,
		};
	}

	const baseUrl = resolveOpencodeAppUrl({
		baseUrl: coderBaseUrl,
		app: appInfo.app,
		agentName: appInfo.agent.name,
		ownerName: workspace.owner_name,
		workspaceName: workspace.name,
		wildcardHostname,
	});

	return { baseUrl, appInfo };
}

export function isOpenCodeUrlError(
	result: OpenCodeUrlResult | OpenCodeUrlError,
): result is OpenCodeUrlError {
	return "type" in result && "message" in result && !("baseUrl" in result);
}
