import type { TypesGen } from "@coder/sdk";
import {
	findOpenCodeApp,
	isOpenCodeUrlError,
	OPENCODE_APP_SLUG,
	OPENCODE_DEFAULT_PORT,
	resolveOpenCodeUrl,
	resolveOpencodeAppUrl,
} from "./workspace-apps";

function createMockApp(
	overrides: Partial<TypesGen.WorkspaceApp> = {},
): TypesGen.WorkspaceApp {
	return {
		id: "app-1",
		slug: "test-app",
		display_name: "Test App",
		external: false,
		subdomain: false,
		health: "healthy",
		sharing_level: "owner",
		hidden: false,
		open_in: "tab",
		statuses: [],
		...overrides,
	} as TypesGen.WorkspaceApp;
}

function createMockAgent(
	apps: TypesGen.WorkspaceApp[],
	overrides: Partial<TypesGen.WorkspaceAgent> = {},
): TypesGen.WorkspaceAgent {
	return {
		id: "agent-1",
		name: "main",
		status: "connected",
		apps,
		...overrides,
	} as TypesGen.WorkspaceAgent;
}

function createMockWorkspace(
	agents: TypesGen.WorkspaceAgent[],
	overrides: Partial<TypesGen.Workspace> = {},
): TypesGen.Workspace {
	return {
		id: "ws-1",
		name: "my-workspace",
		owner_name: "testuser",
		latest_build: {
			status: "running",
			resources: [
				{
					id: "resource-1",
					agents,
				},
			],
		},
		...overrides,
	} as unknown as TypesGen.Workspace;
}

describe("findOpenCodeApp", () => {
	it("finds app by slug 'opencode'", () => {
		const opencodeApp = createMockApp({ slug: OPENCODE_APP_SLUG });
		const agent = createMockAgent([opencodeApp]);
		const workspace = createMockWorkspace([agent]);

		const result = findOpenCodeApp(workspace);

		expect(result).not.toBeNull();
		expect(result?.app.slug).toBe(OPENCODE_APP_SLUG);
		expect(result?.agent.name).toBe("main");
	});

	it("finds app by port 4096 if no slug match", () => {
		const portApp = createMockApp({
			slug: "other-app",
			url: `http://localhost:${OPENCODE_DEFAULT_PORT}`,
		});
		const agent = createMockAgent([portApp]);
		const workspace = createMockWorkspace([agent]);

		const result = findOpenCodeApp(workspace);

		expect(result).not.toBeNull();
		expect(result?.app.slug).toBe("other-app");
	});

	it("prefers slug match over port match", () => {
		const portApp = createMockApp({
			slug: "port-app",
			url: `http://localhost:${OPENCODE_DEFAULT_PORT}`,
		});
		const slugApp = createMockApp({ slug: OPENCODE_APP_SLUG });
		const agent = createMockAgent([portApp, slugApp]);
		const workspace = createMockWorkspace([agent]);

		const result = findOpenCodeApp(workspace);

		expect(result?.app.slug).toBe(OPENCODE_APP_SLUG);
	});

	it("returns null when no matching app", () => {
		const otherApp = createMockApp({
			slug: "other",
			url: "http://localhost:3000",
		});
		const agent = createMockAgent([otherApp]);
		const workspace = createMockWorkspace([agent]);

		const result = findOpenCodeApp(workspace);

		expect(result).toBeNull();
	});

	it("returns null when no agents", () => {
		const workspace = createMockWorkspace([]);

		const result = findOpenCodeApp(workspace);

		expect(result).toBeNull();
	});

	it("returns null when no resources", () => {
		const workspace = {
			id: "ws-1",
			name: "my-workspace",
			owner_name: "testuser",
			latest_build: { status: "running", resources: [] },
		} as unknown as TypesGen.Workspace;

		const result = findOpenCodeApp(workspace);

		expect(result).toBeNull();
	});
});

describe("resolveOpencodeAppUrl", () => {
	it("resolves subdomain app url", () => {
		const app = createMockApp({
			slug: OPENCODE_APP_SLUG,
			subdomain: true,
			subdomain_name: "opencode--lionzhd--shekohex",
		});

		const url = resolveOpencodeAppUrl({
			baseUrl: "https://coder.example.com",
			app,
			agentName: "main",
			ownerName: "shekohex",
			workspaceName: "lionzhd",
			wildcardHostname: "*.coder.example.com",
		});

		expect(url).toBe("https://opencode--lionzhd--shekohex.coder.example.com/");
	});

	it("resolves path-based app url when no wildcard", () => {
		const app = createMockApp({ slug: OPENCODE_APP_SLUG });

		const url = resolveOpencodeAppUrl({
			baseUrl: "https://coder.example.com",
			app,
			agentName: "main",
			ownerName: "testuser",
			workspaceName: "myws",
			wildcardHostname: null,
		});

		expect(url).toBe(
			"https://coder.example.com/@testuser/myws.main/apps/opencode/",
		);
	});

	it("resolves path-based app url when app is not subdomain", () => {
		const app = createMockApp({ slug: OPENCODE_APP_SLUG, subdomain: false });

		const url = resolveOpencodeAppUrl({
			baseUrl: "https://coder.example.com",
			app,
			agentName: "main",
			ownerName: "testuser",
			workspaceName: "myws",
			wildcardHostname: "*.coder.example.com",
		});

		expect(url).toBe(
			"https://coder.example.com/@testuser/myws.main/apps/opencode/",
		);
	});

	it("uses pathAppUrl when provided", () => {
		const app = createMockApp({ slug: OPENCODE_APP_SLUG });

		const url = resolveOpencodeAppUrl({
			baseUrl: "https://coder.example.com",
			app,
			agentName: "main",
			ownerName: "testuser",
			workspaceName: "myws",
			pathAppUrl: "https://proxy.example.com",
		});

		expect(url).toBe(
			"https://proxy.example.com/@testuser/myws.main/apps/opencode/",
		);
	});
});

describe("resolveOpenCodeUrl", () => {
	it("returns error when workspace not running", () => {
		const workspace = {
			id: "ws-1",
			name: "my-workspace",
			owner_name: "testuser",
			latest_build: { status: "stopped", resources: [] },
		} as unknown as TypesGen.Workspace;

		const result = resolveOpenCodeUrl("https://coder.example.com", workspace);

		expect(isOpenCodeUrlError(result)).toBe(true);
		if (isOpenCodeUrlError(result)) {
			expect(result.type).toBe("workspace_not_running");
		}
	});

	it("returns error when no resources", () => {
		const workspace = {
			id: "ws-1",
			name: "my-workspace",
			owner_name: "testuser",
			latest_build: { status: "running", resources: [] },
		} as unknown as TypesGen.Workspace;

		const result = resolveOpenCodeUrl("https://coder.example.com", workspace);

		expect(isOpenCodeUrlError(result)).toBe(true);
		if (isOpenCodeUrlError(result)) {
			expect(result.type).toBe("no_resources");
		}
	});

	it("returns error when no agents", () => {
		const workspace = {
			id: "ws-1",
			name: "my-workspace",
			owner_name: "testuser",
			latest_build: {
				status: "running",
				resources: [{ id: "r1", agents: [] }],
			},
		} as unknown as TypesGen.Workspace;

		const result = resolveOpenCodeUrl("https://coder.example.com", workspace);

		expect(isOpenCodeUrlError(result)).toBe(true);
		if (isOpenCodeUrlError(result)) {
			expect(result.type).toBe("no_agents");
		}
	});

	it("returns error when no matching app", () => {
		const otherApp = createMockApp({
			slug: "other",
			url: "http://localhost:3000",
		});
		const agent = createMockAgent([otherApp]);
		const workspace = createMockWorkspace([agent]);

		const result = resolveOpenCodeUrl("https://coder.example.com", workspace);

		expect(isOpenCodeUrlError(result)).toBe(true);
		if (isOpenCodeUrlError(result)) {
			expect(result.type).toBe("no_app");
		}
	});

	it("returns url and app info on success", () => {
		const opencodeApp = createMockApp({ slug: OPENCODE_APP_SLUG });
		const agent = createMockAgent([opencodeApp]);
		const workspace = createMockWorkspace([agent]);

		const result = resolveOpenCodeUrl("https://coder.example.com", workspace);

		expect(isOpenCodeUrlError(result)).toBe(false);
		if (!isOpenCodeUrlError(result)) {
			expect(result.baseUrl).toContain("opencode");
			expect(result.appInfo.app.slug).toBe(OPENCODE_APP_SLUG);
		}
	});
});
