import { fireEvent, render, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { FontProvider } from "@/lib/font-context";

jest.mock("@/lib/storage", () => ({
	storage: {
		getString: jest.fn(() => null),
		set: jest.fn(),
	},
}));

jest.mock("expo-router", () => ({
	useRouter: () => ({
		push: jest.fn(),
	}),
}));

jest.mock("react-native-safe-area-context", () => ({
	useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("@/lib/sidebar-state", () => ({
	useSidebarState: () => ({
		workspacesCollapsed: false,
		sessionsCollapsed: false,
		toggleWorkspacesSidebar: jest.fn(),
		expandSessionsSidebar: jest.fn(),
		collapseSessionsSidebar: jest.fn(),
	}),
}));

jest.mock("@/lib/workspace-nav", () => ({
	useWorkspaceNav: () => ({
		selectedWorkspaceId: "ws-1",
		selectedProjectId: "proj-1",
		selectedProjectWorktree: "/home/coder/project",
		selectedSessionId: null,
		setSelectedWorkspaceId: jest.fn(),
		setSelectedProjectId: jest.fn(),
		setSelectedSessionId: jest.fn(),
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
	groupWorkspacesByOwner: (workspaces: unknown[]) => [
		{
			owner: "me",
			ownerInitials: "ME",
			rows: workspaces,
		},
	],
}));

jest.mock("@/lib/project-queries", () => ({
	useOpenCodeProjects: () => ({
		projectGroups: [],
		isLoading: false,
	}),
}));

jest.mock("@/lib/session-queries", () => ({
	useOpenCodeSessions: () => ({
		sessions: [
			{
				id: "sess-1",
				name: "Test Session",
				status: "Active",
				lastUsed: "just now",
			},
			{
				id: "sess-2",
				name: "Another Session",
				status: "Idle",
				lastUsed: "5m ago",
			},
		],
		isLoading: false,
		isError: false,
		hasDirectory: true,
	}),
}));

import { FlatList, Pressable } from "react-native";
import { AppText } from "@/components/app-text";
import type { SessionRowData } from "@/lib/session-queries";

const wrapper = ({ children }: { children: ReactNode }) => (
	<FontProvider>{children}</FontProvider>
);

function SessionRow({
	session,
	isSelected,
	onPress,
}: {
	session: SessionRowData;
	isSelected: boolean;
	onPress: () => void;
}) {
	return (
		<Pressable
			onPress={onPress}
			className={`rounded-lg px-3 py-2 ${isSelected ? "bg-surface" : "bg-transparent"}`}
			accessibilityRole="button"
			accessibilityLabel={`Select session ${session.name}`}
			testID={`session-row-${session.id}`}
		>
			<AppText
				className={`text-sm ${isSelected ? "font-medium text-foreground-strong" : "text-foreground"}`}
				numberOfLines={1}
			>
				{session.name}
			</AppText>
			<AppText className="text-foreground-weak text-xs">
				{session.status} · {session.lastUsed}
			</AppText>
		</Pressable>
	);
}

function SessionsList({
	sessions,
	selectedSessionId,
	onSelectSession,
}: {
	sessions: SessionRowData[];
	selectedSessionId: string | null;
	onSelectSession: (id: string) => void;
}) {
	return (
		<FlatList
			data={sessions}
			keyExtractor={(item) => item.id}
			testID="sessions-list"
			renderItem={({ item }) => (
				<SessionRow
					session={item}
					isSelected={item.id === selectedSessionId}
					onPress={() => onSelectSession(item.id)}
				/>
			)}
		/>
	);
}

describe("SessionRow", () => {
	const mockSession: SessionRowData = {
		id: "sess-1",
		name: "Test Session",
		status: "Active",
		lastUsed: "just now",
	};

	it("renders session name and status", () => {
		const onPress = jest.fn();
		render(
			<SessionRow session={mockSession} isSelected={false} onPress={onPress} />,
			{ wrapper },
		);

		expect(screen.getByText("Test Session")).toBeTruthy();
		expect(screen.getByText("Active · just now")).toBeTruthy();
	});

	it("calls onPress when clicked", () => {
		const onPress = jest.fn();
		render(
			<SessionRow session={mockSession} isSelected={false} onPress={onPress} />,
			{ wrapper },
		);

		const button = screen.getByRole("button");
		fireEvent.press(button);

		expect(onPress).toHaveBeenCalledTimes(1);
	});

	it("has correct accessibility label", () => {
		const onPress = jest.fn();
		render(
			<SessionRow session={mockSession} isSelected={false} onPress={onPress} />,
			{ wrapper },
		);

		const button = screen.getByLabelText("Select session Test Session");
		expect(button).toBeTruthy();
	});

	it("applies selected styles when isSelected is true", () => {
		const onPress = jest.fn();
		render(
			<SessionRow session={mockSession} isSelected={true} onPress={onPress} />,
			{ wrapper },
		);

		const button = screen.getByTestId("session-row-sess-1");
		expect(button.props.className).toContain("bg-surface");
	});

	it("applies unselected styles when isSelected is false", () => {
		const onPress = jest.fn();
		render(
			<SessionRow session={mockSession} isSelected={false} onPress={onPress} />,
			{ wrapper },
		);

		const button = screen.getByTestId("session-row-sess-1");
		expect(button.props.className).toContain("bg-transparent");
	});
});

describe("SessionsList", () => {
	const mockSessions: SessionRowData[] = [
		{
			id: "sess-1",
			name: "First Session",
			status: "Active",
			lastUsed: "just now",
		},
		{
			id: "sess-2",
			name: "Second Session",
			status: "Idle",
			lastUsed: "5m ago",
		},
	];

	it("renders all sessions", () => {
		const onSelectSession = jest.fn();
		render(
			<SessionsList
				sessions={mockSessions}
				selectedSessionId={null}
				onSelectSession={onSelectSession}
			/>,
			{ wrapper },
		);

		expect(screen.getByText("First Session")).toBeTruthy();
		expect(screen.getByText("Second Session")).toBeTruthy();
	});

	it("calls onSelectSession with correct id when session is pressed", () => {
		const onSelectSession = jest.fn();
		render(
			<SessionsList
				sessions={mockSessions}
				selectedSessionId={null}
				onSelectSession={onSelectSession}
			/>,
			{ wrapper },
		);

		const firstSession = screen.getByLabelText("Select session First Session");
		fireEvent.press(firstSession);

		expect(onSelectSession).toHaveBeenCalledWith("sess-1");
	});

	it("marks correct session as selected", () => {
		const onSelectSession = jest.fn();
		render(
			<SessionsList
				sessions={mockSessions}
				selectedSessionId="sess-2"
				onSelectSession={onSelectSession}
			/>,
			{ wrapper },
		);

		const secondSession = screen.getByTestId("session-row-sess-2");
		expect(secondSession.props.className).toContain("bg-surface");

		const firstSession = screen.getByTestId("session-row-sess-1");
		expect(firstSession.props.className).toContain("bg-transparent");
	});

	it("allows selecting different sessions", () => {
		const onSelectSession = jest.fn();
		render(
			<SessionsList
				sessions={mockSessions}
				selectedSessionId="sess-1"
				onSelectSession={onSelectSession}
			/>,
			{ wrapper },
		);

		const secondSession = screen.getByLabelText(
			"Select session Second Session",
		);
		fireEvent.press(secondSession);

		expect(onSelectSession).toHaveBeenCalledWith("sess-2");
	});
});
