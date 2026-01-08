import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render } from "@testing-library/react-native";
import type React from "react";

import WorkspacesProjectsScreen from "@/app/(app)/(drawer)/workspaces/projects";
import WorkspacesSessionsScreen from "@/app/(app)/(drawer)/workspaces/sessions";
import { workspaceGroups } from "@/components/workspace-mockups/mock-data";
import { AppShell } from "@/components/workspace-mockups/shared";
import { FontProvider } from "@/lib/font-context";
import { GlobalOpenCodeProvider } from "@/lib/opencode-provider";
import { ThemeProvider } from "@/lib/theme-context";
import { WorkspaceNavProvider } from "@/lib/workspace-nav";

jest.mock("@/lib/auth", () => ({
	useSession: () => ({
		session: "test-token",
		baseUrl: "https://coder.example.com",
		isLoading: false,
	}),
}));

jest.mock("@/lib/workspace-queries", () => ({
	useWorkspaces: () => ({
		data: [
			{
				id: "ws-1",
				name: "test-workspace",
				latest_build: { status: "running" },
			},
		],
		isLoading: false,
		isError: false,
	}),
}));

jest.mock("@/lib/deployment-config", () => ({
	useWildcardAccessUrl: () => ({
		wildcardAccessUrl: null,
		isLoading: false,
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
					<GlobalOpenCodeProvider>
						<WorkspaceNavProvider>{children}</WorkspaceNavProvider>
					</GlobalOpenCodeProvider>
				</FontProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
};

describe("Workspace lists", () => {
	it("scrolls the projects list", () => {
		const { getByTestId } = render(<WorkspacesProjectsScreen />, {
			wrapper: createWrapper(),
		});

		const list = getByTestId("projects-list");
		fireEvent.scroll(list, {
			nativeEvent: {
				contentOffset: { y: 200 },
				layoutMeasurement: { height: 400, width: 300 },
				contentSize: { height: 800, width: 300 },
			},
		});
		expect(list).toBeTruthy();
	});

	it("scrolls the sessions list", () => {
		const { getByTestId } = render(<WorkspacesSessionsScreen />, {
			wrapper: createWrapper(),
		});

		const list = getByTestId("sessions-list");
		fireEvent.scroll(list, {
			nativeEvent: {
				contentOffset: { y: 200 },
				layoutMeasurement: { height: 400, width: 300 },
				contentSize: { height: 800, width: 300 },
			},
		});
		expect(list).toBeTruthy();
	});

	it("does not log contextType warning in workspace list", () => {
		const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

		render(
			<AppShell breakpoint="desktop" workspaceGroups={workspaceGroups} />,
			{
				wrapper: createWrapper(),
			},
		);

		const warningCalls = errorSpy.mock.calls
			.flat()
			.filter((value) => typeof value === "string")
			.filter((value) =>
				value.includes("Function components do not support contextType."),
			);

		expect(warningCalls).toHaveLength(0);

		errorSpy.mockRestore();
	});
});
