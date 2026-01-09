import { API } from "@coder/sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react-native";
import type React from "react";

import WorkspacesScreen from "@/app/(app)/(drawer)/workspaces/index.native";
import { FontProvider } from "@/lib/font-context";
import { NuqsAdapter } from "@/lib/nuqs-adapter";
import { ThemeProvider } from "@/lib/theme-context";
import { WorkspaceNavProvider } from "@/lib/workspace-nav";

jest.mock("@coder/sdk", () => ({
	API: {
		getWorkspaces: jest.fn(),
	},
	TypesGen: {
		SessionTokenHeader: "Coder-Session-Token",
	},
}));

jest.mock("expo-router", () => ({
	useGlobalSearchParams: () => ({}),
	useSegments: () => [],
	router: {
		setParams: jest.fn(),
	},
	useLocalSearchParams: () => ({}),
	useNavigation: () => ({
		dispatch: jest.fn(),
	}),
	Link: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock("@/lib/hooks/use-workspace-layout", () => ({
	useWorkspaceLayout: () => ({ width: 320, height: 640 }),
}));

jest.mock("@/lib/use-coder-browser", () => ({
	useCoderBrowser: () => ({
		openTemplates: jest.fn(),
		openBuildPage: jest.fn(),
	}),
}));

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});
	return ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<FontProvider>
					<NuqsAdapter>
						<WorkspaceNavProvider>{children}</WorkspaceNavProvider>
					</NuqsAdapter>
				</FontProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
};

const createMockWorkspace = (overrides: Record<string, unknown> = {}) => ({
	id: "ws-123",
	created_at: "2024-01-01T00:00:00Z",
	updated_at: "2024-01-01T00:00:00Z",
	owner_id: "user-1",
	owner_name: "john_doe",
	owner_avatar_url: "",
	organization_id: "org-1",
	organization_name: "default",
	template_id: "tpl-1",
	template_name: "ubuntu",
	template_display_name: "Ubuntu",
	template_icon: "",
	template_allow_user_cancel_workspace_jobs: true,
	template_active_version_id: "v1",
	template_require_active_version: false,
	template_use_classic_parameter_flow: false,
	latest_build: {
		id: "build-1",
		status: "running",
	},
	latest_app_status: null,
	outdated: false,
	name: "my-workspace",
	last_used_at: new Date().toISOString(),
	deleting_at: null,
	dormant_at: null,
	health: {
		healthy: true,
		failing_agents: [],
	},
	automatic_updates: "never",
	allow_renames: true,
	favorite: false,
	next_start_at: null,
	is_prebuild: false,
	...overrides,
});

describe("WorkspacesScreen", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders loading state initially", async () => {
		let resolvePromise: ((value: unknown) => void) | undefined;
		const pendingPromise = new Promise((resolve) => {
			resolvePromise = resolve;
		});
		(API.getWorkspaces as jest.Mock).mockReturnValue(pendingPromise);

		const { getByText } = render(<WorkspacesScreen />, {
			wrapper: createWrapper(),
		});

		expect(getByText("Workspaces")).toBeTruthy();

		resolvePromise?.({ workspaces: [], count: 0 });
	});

	it("renders empty state when no workspaces", async () => {
		(API.getWorkspaces as jest.Mock).mockResolvedValue({
			workspaces: [],
			count: 0,
		});

		const { findByText } = render(<WorkspacesScreen />, {
			wrapper: createWrapper(),
		});

		const emptyText = await findByText("No workspaces yet");
		expect(emptyText).toBeTruthy();
	});

	it("renders workspaces list when data is available", async () => {
		const mockWorkspaces = [
			createMockWorkspace({ name: "dev-env", owner_name: "alice" }),
			createMockWorkspace({ name: "staging", owner_name: "bob" }),
		];
		(API.getWorkspaces as jest.Mock).mockResolvedValue({
			workspaces: mockWorkspaces,
			count: 2,
		});

		const { findByText } = render(<WorkspacesScreen />, {
			wrapper: createWrapper(),
		});

		const devEnv = await findByText("dev-env");
		const staging = await findByText("staging");
		expect(devEnv).toBeTruthy();
		expect(staging).toBeTruthy();
	});

	it("renders error state when API fails", async () => {
		(API.getWorkspaces as jest.Mock).mockRejectedValue(
			new Error("Network error"),
		);

		const { findByText } = render(<WorkspacesScreen />, {
			wrapper: createWrapper(),
		});

		const errorText = await findByText("Sync issue");
		expect(errorText).toBeTruthy();
	});

	it("displays workspace status correctly", async () => {
		const mockWorkspaces = [
			createMockWorkspace({
				name: "running-ws",
				latest_build: { id: "build-1", status: "running" },
			}),
		];
		(API.getWorkspaces as jest.Mock).mockResolvedValue({
			workspaces: mockWorkspaces,
			count: 1,
		});

		const { findByText } = render(<WorkspacesScreen />, {
			wrapper: createWrapper(),
		});

		const runningText = await findByText("Running");
		expect(runningText).toBeTruthy();
	});

	it("displays starting status with warning tone", async () => {
		const mockWorkspaces = [
			createMockWorkspace({
				name: "starting-ws",
				latest_build: { id: "build-1", status: "starting" },
			}),
		];
		(API.getWorkspaces as jest.Mock).mockResolvedValue({
			workspaces: mockWorkspaces,
			count: 1,
		});

		const { findByText } = render(<WorkspacesScreen />, {
			wrapper: createWrapper(),
		});

		const startingText = await findByText("Starting");
		expect(startingText).toBeTruthy();
	});

	it("groups workspaces by owner", async () => {
		const mockWorkspaces = [
			createMockWorkspace({ name: "ws-1", owner_name: "alice" }),
			createMockWorkspace({ name: "ws-2", owner_name: "alice" }),
			createMockWorkspace({ name: "ws-3", owner_name: "bob" }),
		];
		(API.getWorkspaces as jest.Mock).mockResolvedValue({
			workspaces: mockWorkspaces,
			count: 3,
		});

		const { findByText } = render(<WorkspacesScreen />, {
			wrapper: createWrapper(),
		});

		const aliceGroup = await findByText("alice");
		const bobGroup = await findByText("bob");
		expect(aliceGroup).toBeTruthy();
		expect(bobGroup).toBeTruthy();
	});
});
