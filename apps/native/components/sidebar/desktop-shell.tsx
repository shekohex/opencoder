import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import { useCallback, useMemo } from "react";
import { FlatList, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "@/components/app-text";
import {
	EmptyStateCard,
	ErrorBanner,
	type ListState,
	LoadingList,
} from "@/components/list-states";
import { WorkspaceCard } from "@/components/workspace-mockups/workspace-card";
import { useOpenCodeProjects } from "@/lib/project-queries";
import {
	type SessionRowData,
	useOpenCodeSessions,
} from "@/lib/session-queries";
import { useSidebarState } from "@/lib/sidebar-state";
import { useWorkspaceNav } from "@/lib/workspace-nav";
import {
	groupWorkspacesByOwner,
	useWorkspaces,
	type WorkspaceGroup,
} from "@/lib/workspace-queries";
import { DesktopSidebar } from "./desktop-sidebar";
import { type ProjectItem, ProjectsInlineList } from "./projects-inline-list";
import { SessionsSidebar } from "./sessions-sidebar";

const ROW_HEIGHT = 64;

export function DesktopShell({ children }: { children?: ReactNode }) {
	const insets = useSafeAreaInsets();
	const router = useRouter();

	const {
		workspacesCollapsed,
		sessionsCollapsed,
		toggleWorkspacesSidebar,
		expandSessionsSidebar,
		collapseSessionsSidebar,
	} = useSidebarState();

	const {
		selectedWorkspaceId,
		selectedProjectId,
		selectedProjectWorktree,
		selectedSessionId,
		setSelectedWorkspaceId,
		setSelectedProjectId,
		setSelectedSessionId,
	} = useWorkspaceNav();

	const { data: workspaces, isLoading, isError } = useWorkspaces();

	const workspaceGroups = useMemo(() => {
		if (!workspaces) return [];
		return groupWorkspacesByOwner(workspaces);
	}, [workspaces]);

	const selectedWorkspace = useMemo(() => {
		if (!workspaces || !selectedWorkspaceId) return null;
		return workspaces.find((w) => w.id === selectedWorkspaceId);
	}, [workspaces, selectedWorkspaceId]);

	const connectionStatus = useMemo(() => {
		if (!selectedWorkspace) return "disconnected" as const;
		const status = selectedWorkspace.latest_build?.status;
		if (status === "running") return "connected" as const;
		if (status === "starting" || status === "pending")
			return "connecting" as const;
		if (status === "failed" || status === "canceled") return "error" as const;
		return "disconnected" as const;
	}, [selectedWorkspace]);

	const handleSettingsPress = useCallback(() => {
		router.push("/settings");
	}, [router]);

	const handleWorkspaceSelect = useCallback(
		(workspaceId: string) => {
			setSelectedWorkspaceId(workspaceId);
		},
		[setSelectedWorkspaceId],
	);

	const handleProjectSelect = useCallback(
		(projectId: string, worktree?: string) => {
			setSelectedProjectId(projectId, worktree);
			expandSessionsSidebar();
		},
		[setSelectedProjectId, expandSessionsSidebar],
	);

	const handleSessionSelect = useCallback(
		(sessionId: string) => {
			setSelectedSessionId(sessionId);
		},
		[setSelectedSessionId],
	);

	const listState: ListState = isLoading
		? "loading"
		: isError
			? "error"
			: workspaceGroups.length === 0
				? "empty"
				: "ready";

	return (
		<View
			className="flex-1 flex-row bg-background"
			style={{ paddingTop: insets.top }}
		>
			<DesktopSidebar
				collapsed={workspacesCollapsed}
				status={connectionStatus}
				onSettingsPress={handleSettingsPress}
				onTogglePress={toggleWorkspacesSidebar}
			>
				<WorkspacesList
					workspaceGroups={workspaceGroups}
					selectedWorkspaceId={selectedWorkspaceId}
					selectedProjectId={selectedProjectId}
					onSelectWorkspace={handleWorkspaceSelect}
					onSelectProject={handleProjectSelect}
					listState={listState}
					collapsed={workspacesCollapsed}
				/>
			</DesktopSidebar>

			<SessionsSidebar
				collapsed={sessionsCollapsed}
				projectName={selectedProjectWorktree?.split("/").pop()}
				onTogglePress={collapseSessionsSidebar}
			>
				<SessionsList
					workspaceId={selectedWorkspaceId}
					worktree={selectedProjectWorktree}
					selectedSessionId={selectedSessionId}
					onSelectSession={handleSessionSelect}
				/>
			</SessionsSidebar>

			<View className="flex-1">{children}</View>
		</View>
	);
}

function WorkspacesList({
	workspaceGroups,
	selectedWorkspaceId,
	selectedProjectId,
	onSelectWorkspace,
	onSelectProject,
	listState,
	collapsed,
}: {
	workspaceGroups: WorkspaceGroup[];
	selectedWorkspaceId: string | null;
	selectedProjectId: string | null;
	onSelectWorkspace: (id: string) => void;
	onSelectProject: (id: string, worktree?: string) => void;
	listState: ListState;
	collapsed: boolean;
}) {
	const workspaceRows = useMemo(
		() =>
			workspaceGroups.flatMap((group) =>
				group.rows.map((row) => ({
					...row,
					ownerInitials: group.ownerInitials,
				})),
			),
		[workspaceGroups],
	);

	if (collapsed) {
		return (
			<FlatList
				data={workspaceRows}
				keyExtractor={(item) => item.id ?? item.name}
				contentContainerStyle={{ paddingVertical: 8 }}
				renderItem={({ item }) => (
					<CollapsedWorkspaceIcon
						initials={item.ownerInitials}
						isSelected={(item.id ?? item.name) === selectedWorkspaceId}
						onPress={() => onSelectWorkspace(item.id ?? item.name)}
					/>
				)}
			/>
		);
	}

	if (listState === "loading") {
		return <LoadingList count={5} rowHeight={ROW_HEIGHT} />;
	}

	if (listState === "error") {
		return (
			<View className="p-3">
				<ErrorBanner
					title="Failed to load"
					subtitle="Unable to load workspaces"
					ctaLabel="Retry"
				/>
			</View>
		);
	}

	if (listState === "empty") {
		return (
			<View className="p-3">
				<EmptyStateCard
					title="No workspaces"
					subtitle="Create a workspace to get started"
					ctaLabel="Create workspace"
				/>
			</View>
		);
	}

	return (
		<FlatList
			data={workspaceRows}
			keyExtractor={(item) => item.id ?? item.name}
			contentContainerStyle={{ paddingBottom: 12 }}
			renderItem={({ item }) => {
				const isSelected = (item.id ?? item.name) === selectedWorkspaceId;
				return (
					<WorkspaceRowWithProjects
						row={item}
						ownerInitials={item.ownerInitials}
						isSelected={isSelected}
						selectedProjectId={selectedProjectId}
						onSelectWorkspace={() => onSelectWorkspace(item.id ?? item.name)}
						onSelectProject={onSelectProject}
					/>
				);
			}}
		/>
	);
}

function WorkspaceRowWithProjects({
	row,
	ownerInitials,
	isSelected,
	selectedProjectId,
	onSelectWorkspace,
	onSelectProject,
}: {
	row: WorkspaceGroup["rows"][number];
	ownerInitials: string;
	isSelected: boolean;
	selectedProjectId: string | null;
	onSelectWorkspace: () => void;
	onSelectProject: (id: string, worktree?: string) => void;
}) {
	const { projectGroups, isLoading } = useOpenCodeProjects(row.id ?? null);

	const projects: ProjectItem[] = useMemo(() => {
		if (!projectGroups) return [];
		return projectGroups.flatMap((group) =>
			group.rows.map((p) => ({
				id: p.id,
				name: p.name,
				worktree: p.worktree,
				isPinned: false,
				isRecent: true,
			})),
		);
	}, [projectGroups]);

	return (
		<View>
			<WorkspaceCard
				row={row}
				ownerInitials={ownerInitials}
				rowHeight={ROW_HEIGHT}
				isSelected={isSelected}
				onPress={onSelectWorkspace}
			/>
			{isSelected && !isLoading && (
				<ProjectsInlineList
					projects={projects}
					selectedProjectId={selectedProjectId}
					onSelectProject={onSelectProject}
				/>
			)}
		</View>
	);
}

function CollapsedWorkspaceIcon({
	initials,
	isSelected,
	onPress,
}: {
	initials: string;
	isSelected: boolean;
	onPress: () => void;
}) {
	return (
		<Pressable
			onPress={onPress}
			className={`mx-auto my-1 h-10 w-10 items-center justify-center rounded-lg ${
				isSelected ? "bg-surface" : "bg-transparent"
			}`}
			accessibilityRole="button"
		>
			<AppText className="font-semibold text-foreground-strong text-xs">
				{initials}
			</AppText>
		</Pressable>
	);
}

function SessionsList({
	workspaceId,
	worktree,
	selectedSessionId,
	onSelectSession,
}: {
	workspaceId: string | null;
	worktree: string | null | undefined;
	selectedSessionId: string | null;
	onSelectSession: (id: string) => void;
}) {
	const { sessions, isLoading, isError, hasDirectory } = useOpenCodeSessions(
		workspaceId,
		worktree ?? undefined,
	);

	if (!hasDirectory) {
		return (
			<View className="p-3">
				<EmptyStateCard
					title="Select a project"
					subtitle="Choose a project to view sessions"
				/>
			</View>
		);
	}

	if (isLoading) {
		return <LoadingList count={4} rowHeight={48} />;
	}

	if (isError) {
		return (
			<View className="p-3">
				<ErrorBanner
					title="Failed to load"
					subtitle="Unable to load sessions"
					ctaLabel="Retry"
				/>
			</View>
		);
	}

	if (sessions.length === 0) {
		return (
			<View className="p-3">
				<EmptyStateCard
					title="No sessions"
					subtitle="Create a session to start coding"
				/>
			</View>
		);
	}

	return (
		<FlatList
			data={sessions}
			keyExtractor={(item) => item.id}
			contentContainerStyle={{ padding: 12 }}
			ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
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
