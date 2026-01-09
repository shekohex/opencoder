import { renderHook } from "@testing-library/react-native";
import type { ReactNode } from "react";

const mockReplace = jest.fn();

jest.mock("expo-router", () => ({
	useGlobalSearchParams: () => ({
		workspaceId: "ws-1",
		projectId: "proj-1",
		sessionId: "sess-1",
	}),
	useSegments: () => [],
	useRouter: () => ({
		replace: mockReplace,
	}),
}));

import { NuqsAdapter } from "./nuqs-adapter";
import {
	useWorkspaceNav,
	useWorkspaceNavigation,
	WorkspaceNavProvider,
} from "./workspace-nav";

const wrapper = ({ children }: { children: ReactNode }) => (
	<NuqsAdapter>
		<WorkspaceNavProvider>{children}</WorkspaceNavProvider>
	</NuqsAdapter>
);

describe("useWorkspaceNav", () => {
	it("should read values from route params", () => {
		const { result } = renderHook(() => useWorkspaceNav(), { wrapper });

		expect(result.current.selectedWorkspaceId).toBe("ws-1");
		expect(result.current.selectedProjectId).toBe("proj-1");
		expect(result.current.selectedSessionId).toBe("sess-1");
	});
});

describe("useWorkspaceNavigation", () => {
	beforeEach(() => {
		mockReplace.mockClear();
	});

	it("should navigate to workspace", () => {
		const { result } = renderHook(() => useWorkspaceNavigation(), { wrapper });

		result.current.navigateToWorkspace("ws-2");

		expect(mockReplace).toHaveBeenCalledWith("/workspaces/ws-2");
	});

	it("should navigate to project with worktree", () => {
		const { result } = renderHook(() => useWorkspaceNavigation(), { wrapper });

		result.current.navigateToProject("proj-2", "/home/coder/project");

		expect(mockReplace).toHaveBeenCalledWith(
			"/workspaces/ws-1/proj-2?wt=%2Fhome%2Fcoder%2Fproject",
		);
	});

	it("should navigate to session", () => {
		const { result } = renderHook(() => useWorkspaceNavigation(), { wrapper });

		result.current.navigateToSession("sess-2");

		expect(mockReplace).toHaveBeenCalledWith("/workspaces/ws-1/proj-1/sess-2");
	});

	it("should navigate to workspaces root", () => {
		const { result } = renderHook(() => useWorkspaceNavigation(), { wrapper });

		result.current.navigateToWorkspaces();

		expect(mockReplace).toHaveBeenCalledWith("/workspaces");
	});
});
