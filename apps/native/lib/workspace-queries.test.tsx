import type { TypesGen } from "@coder/sdk";
import { API } from "@coder/sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import type React from "react";
import {
	groupWorkspacesByOwner,
	hasActiveBuilds,
	useWorkspaces,
	workspaceToRowData,
} from "./workspace-queries";

jest.mock("@coder/sdk", () => ({
	API: {
		getWorkspaces: jest.fn(),
	},
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
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

const createMockWorkspace = (
	overrides: Partial<TypesGen.Workspace> = {},
): TypesGen.Workspace =>
	({
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
			created_at: "2024-01-01T00:00:00Z",
			updated_at: "2024-01-01T00:00:00Z",
			workspace_id: "ws-123",
			workspace_name: "my-workspace",
			workspace_owner_id: "user-1",
			workspace_owner_name: "john_doe",
			template_version_id: "v1",
			template_version_name: "1.0",
			template_version_preset_id: null,
			build_number: 1,
			transition: "start",
			initiator_id: "user-1",
			initiator_name: "john_doe",
			job: {
				id: "job-1",
				created_at: "2024-01-01T00:00:00Z",
				status: "succeeded",
				queue_position: 0,
				queue_size: 0,
				file_id: "",
				tags: {},
				organization_id: "org-1",
				initiator_id: "user-1",
				input: {},
				type: "workspace_build",
				metadata: {},
				logs_overflowed: false,
			},
			reason: "initiator",
			resources: [],
			status: "running",
			daily_cost: 0,
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
	}) as TypesGen.Workspace;

describe("workspace-queries", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("useWorkspaces", () => {
		it("fetches workspaces from API", async () => {
			const mockWorkspaces = [createMockWorkspace()];
			(API.getWorkspaces as jest.Mock).mockResolvedValue({
				workspaces: mockWorkspaces,
				count: 1,
			});

			const { result } = renderHook(() => useWorkspaces(), {
				wrapper: createWrapper(),
			});

			await waitFor(() => expect(result.current.isSuccess).toBe(true));
			expect(result.current.data).toHaveLength(1);
			expect(result.current.data?.[0].name).toBe("my-workspace");
		});

		it("handles empty workspaces list", async () => {
			(API.getWorkspaces as jest.Mock).mockResolvedValue({
				workspaces: [],
				count: 0,
			});

			const { result } = renderHook(() => useWorkspaces(), {
				wrapper: createWrapper(),
			});

			await waitFor(() => expect(result.current.isSuccess).toBe(true));
			expect(result.current.data).toHaveLength(0);
		});

		it("handles API error", async () => {
			(API.getWorkspaces as jest.Mock).mockRejectedValue(
				new Error("Network error"),
			);

			const { result } = renderHook(() => useWorkspaces(), {
				wrapper: createWrapper(),
			});

			await waitFor(() => expect(result.current.isError).toBe(true));
			expect(result.current.error).toBeInstanceOf(Error);
		});
	});

	describe("workspaceToRowData", () => {
		it("maps running workspace correctly", () => {
			const workspace = createMockWorkspace({
				name: "dev-env",
				favorite: true,
			});

			const row = workspaceToRowData(workspace);

			expect(row.id).toBe("ws-123");
			expect(row.name).toBe("dev-env");
			expect(row.status).toBe("Running");
			expect(row.statusTone).toBe("success");
			expect(row.badges).toContain("favorite");
		});

		it("maps stopped workspace correctly", () => {
			const workspace = createMockWorkspace({
				latest_build: {
					...createMockWorkspace().latest_build,
					status: "stopped",
				},
			});

			const row = workspaceToRowData(workspace);

			expect(row.status).toBe("Stopped");
			expect(row.statusTone).toBe("inactive");
		});

		it("maps starting workspace correctly", () => {
			const workspace = createMockWorkspace({
				latest_build: {
					...createMockWorkspace().latest_build,
					status: "starting",
				},
			});

			const row = workspaceToRowData(workspace);

			expect(row.status).toBe("Starting");
			expect(row.statusTone).toBe("warning");
		});

		it("maps failed workspace correctly", () => {
			const workspace = createMockWorkspace({
				latest_build: {
					...createMockWorkspace().latest_build,
					status: "failed",
				},
			});

			const row = workspaceToRowData(workspace);

			expect(row.status).toBe("Failed");
			expect(row.statusTone).toBe("inactive");
		});

		it("includes outdated badge", () => {
			const workspace = createMockWorkspace({ outdated: true });

			const row = workspaceToRowData(workspace);

			expect(row.badges).toContain("outdated");
		});

		it("includes task badge when task_id is set", () => {
			const workspace = createMockWorkspace({ task_id: "task-123" });

			const row = workspaceToRowData(workspace);

			expect(row.badges).toContain("task");
		});

		it("includes shared badge when shared_with is populated", () => {
			const workspace = createMockWorkspace({
				shared_with: [
					{ id: "user-2", actor_type: "user", name: "alice", roles: [] },
				],
			});

			const row = workspaceToRowData(workspace);

			expect(row.badges).toContain("shared");
		});

		it("formats last used time correctly", () => {
			const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
			const workspace = createMockWorkspace({ last_used_at: fiveMinutesAgo });

			const row = workspaceToRowData(workspace);

			expect(row.lastUsed).toBe("5m ago");
		});

		it("formats last used as just now for recent activity", () => {
			const justNow = new Date().toISOString();
			const workspace = createMockWorkspace({ last_used_at: justNow });

			const row = workspaceToRowData(workspace);

			expect(row.lastUsed).toBe("just now");
		});

		it("formats last used in hours", () => {
			const twoHoursAgo = new Date(
				Date.now() - 2 * 60 * 60 * 1000,
			).toISOString();
			const workspace = createMockWorkspace({ last_used_at: twoHoursAgo });

			const row = workspaceToRowData(workspace);

			expect(row.lastUsed).toBe("2h ago");
		});

		it("formats last used in days", () => {
			const threeDaysAgo = new Date(
				Date.now() - 3 * 24 * 60 * 60 * 1000,
			).toISOString();
			const workspace = createMockWorkspace({ last_used_at: threeDaysAgo });

			const row = workspaceToRowData(workspace);

			expect(row.lastUsed).toBe("3d ago");
		});
	});

	describe("groupWorkspacesByOwner", () => {
		it("groups workspaces by owner", () => {
			const workspaces = [
				createMockWorkspace({ owner_name: "alice", name: "ws-1" }),
				createMockWorkspace({ owner_name: "bob", name: "ws-2" }),
				createMockWorkspace({ owner_name: "alice", name: "ws-3" }),
			];

			const groups = groupWorkspacesByOwner(workspaces);

			expect(groups).toHaveLength(2);

			const aliceGroup = groups.find((g) => g.owner === "alice");
			expect(aliceGroup?.rows).toHaveLength(2);
			expect(aliceGroup?.ownerInitials).toBe("AL");

			const bobGroup = groups.find((g) => g.owner === "bob");
			expect(bobGroup?.rows).toHaveLength(1);
			expect(bobGroup?.ownerInitials).toBe("BO");
		});

		it("returns empty array for empty input", () => {
			const groups = groupWorkspacesByOwner([]);

			expect(groups).toHaveLength(0);
		});

		it("generates initials from multi-word names", () => {
			const workspaces = [
				createMockWorkspace({ owner_name: "john_doe", name: "ws-1" }),
			];

			const groups = groupWorkspacesByOwner(workspaces);

			expect(groups[0].ownerInitials).toBe("JD");
		});

		it("handles single-word owner names", () => {
			const workspaces = [
				createMockWorkspace({ owner_name: "admin", name: "ws-1" }),
			];

			const groups = groupWorkspacesByOwner(workspaces);

			expect(groups[0].ownerInitials).toBe("AD");
		});
	});

	describe("hasActiveBuilds", () => {
		it("returns true for starting workspace", () => {
			const workspaces = [
				createMockWorkspace({
					latest_build: {
						...createMockWorkspace().latest_build,
						status: "starting",
					},
				}),
			];

			expect(hasActiveBuilds(workspaces)).toBe(true);
		});

		it("returns true for stopping workspace", () => {
			const workspaces = [
				createMockWorkspace({
					latest_build: {
						...createMockWorkspace().latest_build,
						status: "stopping",
					},
				}),
			];

			expect(hasActiveBuilds(workspaces)).toBe(true);
		});

		it("returns true for pending workspace", () => {
			const workspaces = [
				createMockWorkspace({
					latest_build: {
						...createMockWorkspace().latest_build,
						status: "pending",
					},
				}),
			];

			expect(hasActiveBuilds(workspaces)).toBe(true);
		});

		it("returns true for canceling workspace", () => {
			const workspaces = [
				createMockWorkspace({
					latest_build: {
						...createMockWorkspace().latest_build,
						status: "canceling",
					},
				}),
			];

			expect(hasActiveBuilds(workspaces)).toBe(true);
		});

		it("returns true for deleting workspace", () => {
			const workspaces = [
				createMockWorkspace({
					latest_build: {
						...createMockWorkspace().latest_build,
						status: "deleting",
					},
				}),
			];

			expect(hasActiveBuilds(workspaces)).toBe(true);
		});

		it("returns false for running workspace", () => {
			const workspaces = [createMockWorkspace()];

			expect(hasActiveBuilds(workspaces)).toBe(false);
		});

		it("returns false for stopped workspace", () => {
			const workspaces = [
				createMockWorkspace({
					latest_build: {
						...createMockWorkspace().latest_build,
						status: "stopped",
					},
				}),
			];

			expect(hasActiveBuilds(workspaces)).toBe(false);
		});

		it("returns false for empty list", () => {
			expect(hasActiveBuilds([])).toBe(false);
		});

		it("returns true if any workspace has active build", () => {
			const workspaces = [
				createMockWorkspace({
					latest_build: {
						...createMockWorkspace().latest_build,
						status: "running",
					},
				}),
				createMockWorkspace({
					latest_build: {
						...createMockWorkspace().latest_build,
						status: "starting",
					},
				}),
			];

			expect(hasActiveBuilds(workspaces)).toBe(true);
		});
	});
});
