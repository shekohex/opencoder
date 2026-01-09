import { renderHook } from "@testing-library/react-native";
import type { ReactNode } from "react";

const mockSearchParams = jest.fn(() => ({}));

jest.mock("expo-router", () => ({
	useGlobalSearchParams: () => mockSearchParams(),
	useLocalSearchParams: () => ({}),
	useSegments: () => [],
	router: {
		setParams: jest.fn(),
	},
}));

import { NuqsAdapter } from "./nuqs-adapter";
import { useWorkspaceNav, WorkspaceNavProvider } from "./workspace-nav";

const wrapper = ({ children }: { children: ReactNode }) => (
	<NuqsAdapter>
		<WorkspaceNavProvider>{children}</WorkspaceNavProvider>
	</NuqsAdapter>
);

describe("useWorkspaceNav", () => {
	beforeEach(() => {
		mockSearchParams.mockReturnValue({});
	});

	it("should initialize with null values when no route params", () => {
		const { result } = renderHook(() => useWorkspaceNav(), { wrapper });

		expect(result.current.selectedWorkspaceId).toBeNull();
		expect(result.current.selectedProjectId).toBeNull();
		expect(result.current.selectedSessionId).toBeNull();
		expect(result.current.selectedProjectWorktree).toBeNull();
	});

	it("should read workspaceId from route params", () => {
		mockSearchParams.mockReturnValue({ workspaceId: "ws-1" });

		const { result } = renderHook(() => useWorkspaceNav(), { wrapper });

		expect(result.current.selectedWorkspaceId).toBe("ws-1");
		expect(result.current.selectedProjectId).toBeNull();
		expect(result.current.selectedSessionId).toBeNull();
	});

	it("should read all params from route", () => {
		mockSearchParams.mockReturnValue({
			workspaceId: "ws-1",
			projectId: "proj-1",
			sessionId: "sess-1",
		});

		const { result } = renderHook(() => useWorkspaceNav(), { wrapper });

		expect(result.current.selectedWorkspaceId).toBe("ws-1");
		expect(result.current.selectedProjectId).toBe("proj-1");
		expect(result.current.selectedSessionId).toBe("sess-1");
	});
});
