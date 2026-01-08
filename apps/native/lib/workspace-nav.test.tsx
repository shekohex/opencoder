import { act, renderHook } from "@testing-library/react-native";
import type { ReactNode } from "react";

jest.mock("expo-router", () => ({
	useGlobalSearchParams: () => ({}),
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
	it("should initialize with null values", () => {
		const { result } = renderHook(() => useWorkspaceNav(), { wrapper });

		expect(result.current.selectedWorkspaceId).toBeNull();
		expect(result.current.selectedProjectId).toBeNull();
		expect(result.current.selectedSessionId).toBeNull();
	});

	it("should reset project and session when workspace changes", () => {
		const { result } = renderHook(() => useWorkspaceNav(), { wrapper });

		act(() => {
			result.current.setSelectedWorkspaceId("ws-1");
			result.current.setSelectedProjectId("proj-1");
			result.current.setSelectedSessionId("sess-1");
		});

		expect(result.current.selectedWorkspaceId).toBe("ws-1");
		expect(result.current.selectedProjectId).toBe("proj-1");
		expect(result.current.selectedSessionId).toBe("sess-1");

		act(() => {
			result.current.setSelectedWorkspaceId("ws-2");
		});

		expect(result.current.selectedWorkspaceId).toBe("ws-2");
		expect(result.current.selectedProjectId).toBeNull();
		expect(result.current.selectedSessionId).toBeNull();
	});

	it("should reset session when project changes", () => {
		const { result } = renderHook(() => useWorkspaceNav(), { wrapper });

		act(() => {
			result.current.setSelectedWorkspaceId("ws-1");
			result.current.setSelectedProjectId("proj-1");
			result.current.setSelectedSessionId("sess-1");
		});

		act(() => {
			result.current.setSelectedProjectId("proj-2");
		});

		expect(result.current.selectedWorkspaceId).toBe("ws-1");
		expect(result.current.selectedProjectId).toBe("proj-2");
		expect(result.current.selectedSessionId).toBeNull();
	});

	it("should clear all selections", () => {
		const { result } = renderHook(() => useWorkspaceNav(), { wrapper });

		act(() => {
			result.current.setSelectedWorkspaceId("ws-1");
			result.current.setSelectedProjectId("proj-1");
			result.current.setSelectedSessionId("sess-1");
		});

		act(() => {
			result.current.clearSelection();
		});

		expect(result.current.selectedWorkspaceId).toBeNull();
		expect(result.current.selectedProjectId).toBeNull();
		expect(result.current.selectedSessionId).toBeNull();
	});
});
