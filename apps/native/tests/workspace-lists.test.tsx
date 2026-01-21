import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render } from "@testing-library/react-native";
import type React from "react";

jest.mock("expo-router", () => ({
	useGlobalSearchParams: () => ({}),
	useLocalSearchParams: () => ({}),
	useSegments: () => [],
	router: {
		setParams: jest.fn(),
	},
	useRouter: () => ({
		push: jest.fn(),
	}),
	useNavigation: () => ({
		dispatch: jest.fn(),
	}),
	Link: ({ children }: { children: React.ReactNode }) => children,
}));

import WorkspaceSessionsScreen from "@/app/(app)/(drawer)/workspaces/[workspaceId]/[projectId]/index";
import WorkspaceProjectsScreen from "@/app/(app)/(drawer)/workspaces/[workspaceId]/index";
import { AppShell } from "@/components/workspace-list/shared";
import { FontProvider } from "@/lib/font-context";
import { NuqsAdapter } from "@/lib/nuqs-adapter";
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
	useWorkspaceName: () => "test-workspace",
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
					<NuqsAdapter>
						<GlobalOpenCodeProvider>
							<WorkspaceNavProvider>{children}</WorkspaceNavProvider>
						</GlobalOpenCodeProvider>
					</NuqsAdapter>
				</FontProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
};

describe("Workspace lists", () => {
	it("scrolls the projects list", () => {
		const { getByTestId } = render(<WorkspaceProjectsScreen />, {
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
		const { getByTestId } = render(<WorkspaceSessionsScreen />, {
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

		const mockWorkspaceGroups = [
			{
				owner: "Test Owner",
				ownerInitials: "TO",
				rows: [
					{
						id: "test-1",
						name: "test-workspace",
						status: "Running",
						statusTone: "success" as const,
						lastUsed: "1m ago",
						badges: [],
					},
				],
			},
		];

		render(
			<AppShell breakpoint="desktop" workspaceGroups={mockWorkspaceGroups} />,
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
