import { Feather } from "@expo/vector-icons";
import { Logo } from "@opencoder/branding";
import {
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated";
import { AppText } from "@/components/app-text";
import { Button } from "@/components/button";
import {
	EmptyStateCard,
	ErrorBanner,
	type ListState,
	LoadingList,
} from "@/components/list-states";
import { ProjectsListContent } from "@/components/projects-list";
import { WorkspaceCard } from "@/components/workspace-mockups/workspace-card";
import { useOpenCodeProjects } from "@/lib/project-queries";
import {
	type SessionRowData as RealSessionRowData,
	useCreateSession,
	useOpenCodeSessions,
} from "@/lib/session-queries";
import { useTheme } from "@/lib/theme-context";
import { useWorkspaceNav, useWorkspaceNavigation } from "@/lib/workspace-nav";
import {
	hasActiveBuilds as checkActiveBuilds,
	groupWorkspacesByOwner,
	useWorkspaces,
	type WorkspaceGroup,
} from "@/lib/workspace-queries";

import {
	buildStatus,
	emptyStateActions,
	messageRows,
	workspaceGroups as workspaceGroupsSeed,
} from "./mock-data";

export type BreakpointName = "desktop" | "tablet";

export type { WorkspaceGroup } from "@/lib/workspace-queries";
export { EmptyStateCard, ErrorBanner, type ListState, LoadingList };

export const ROW_HEIGHTS = {
	desktop: 64,
	tablet: 60,
	mobile: 68,
} as const;

export const SIDEBAR_WIDTHS = {
	desktop: 360,
	tablet: 320,
} as const;

const SIDEBAR_MIN_WIDTH = {
	desktop: 300,
	tablet: 260,
} as const;

const SIDEBAR_MAX_WIDTH = {
	desktop: 420,
	tablet: 360,
} as const;

const MIDDLE_MIN_WIDTH = {
	desktop: 220,
	tablet: 200,
} as const;

const MIDDLE_MAX_WIDTH = {
	desktop: 320,
	tablet: 260,
} as const;

export const RIGHT_PANEL_WIDTH = 240;
const RESIZE_HANDLE_WIDTH = 10;

type SessionRowData = RealSessionRowData;

const POLLING_INTERVAL_ACTIVE = 5000;
const POLLING_INTERVAL_IDLE = 30000;

export function useWorkspacePolling() {
	const { data: workspaces, isLoading, isError, refetch } = useWorkspaces();

	const workspaceGroups = useMemo(() => {
		if (!workspaces) return [];
		return groupWorkspacesByOwner(workspaces);
	}, [workspaces]);

	const hasActiveBuilds = useMemo(() => {
		if (!workspaces) return false;
		return checkActiveBuilds(workspaces);
	}, [workspaces]);

	const intervalMs = hasActiveBuilds
		? POLLING_INTERVAL_ACTIVE
		: POLLING_INTERVAL_IDLE;

	useEffect(() => {
		const intervalId = setInterval(() => {
			refetch();
		}, intervalMs);

		return () => clearInterval(intervalId);
	}, [intervalMs, refetch]);

	return { workspaceGroups, hasActiveBuilds, intervalMs, isLoading, isError };
}

function _buildNewSession(sessions: SessionRowData[]) {
	const existingNames = new Set(sessions.map((session) => session.name));
	let index = 1;
	let name = "New session";

	while (existingNames.has(name)) {
		index += 1;
		name = `New session ${index}`;
	}

	return {
		name,
		status: "New",
		lastUsed: "just now",
	};
}

export function WorkspaceThreePane({
	breakpoint,
	showRightPanel = true,
	height,
	availableWidth,
	isFramed = true,
	selectedWorkspaceId,
	selectedProjectId,
	selectedProjectWorktree,
	onSelectProject,
	onSelectWorkspace,
	onCreateWorkspace,
	selectedSessionId,
	onSelectSession,
}: {
	breakpoint: BreakpointName;
	showRightPanel?: boolean;
	height?: number;
	availableWidth?: number;
	isFramed?: boolean;
	selectedWorkspaceId?: string | null;
	selectedProjectId?: string | null;
	selectedProjectWorktree?: string | null;
	onSelectProject?: (projectId: string, worktree?: string) => void;
	onSelectWorkspace?: (workspaceId: string) => void;
	onCreateWorkspace?: () => void;
	selectedSessionId?: string | null;
	onSelectSession?: (sessionId: string) => void;
}) {
	const {
		sessions: realSessions,
		isLoading: sessionsLoading,
		isError: sessionsError,
		hasDirectory,
	} = useOpenCodeSessions(
		selectedWorkspaceId ?? null,
		selectedProjectWorktree ?? undefined,
	);

	const createSession = useCreateSession(selectedWorkspaceId ?? null);

	const [localSelectedSessionId, setLocalSelectedSessionId] = useState<
		string | null
	>(null);
	const resolvedSelectedSessionId = selectedSessionId ?? localSelectedSessionId;

	const getSessionListState = (): ListState => {
		if (!hasDirectory) return "empty";
		if (sessionsLoading) return "loading";
		if (sessionsError) return "error";
		if (realSessions.length === 0) return "empty";
		return "ready";
	};

	const sessionListState = getSessionListState();
	const sessions: SessionRowData[] =
		sessionListState === "ready" ? realSessions : [];

	const handleSelectSession = (sessionId: string) => {
		if (onSelectSession) {
			onSelectSession(sessionId);
			return;
		}
		setLocalSelectedSessionId(sessionId);
	};

	const handleCreateSession = async () => {
		if (!selectedProjectWorktree) return;
		try {
			const newSession = await createSession.mutateAsync({
				directory: selectedProjectWorktree,
			});
			handleSelectSession(newSession.id);
		} catch {}
	};

	const rowHeight = ROW_HEIGHTS[breakpoint];
	const baseSidebarWidth = SIDEBAR_WIDTHS[breakpoint];
	const baseMiddleWidth = breakpoint === "desktop" ? 260 : 220;
	const minChatWidth = breakpoint === "desktop" ? 320 : 260;
	const rightPanelWidth = showRightPanel ? RIGHT_PANEL_WIDTH : 0;

	const sidebarMin = SIDEBAR_MIN_WIDTH[breakpoint];
	const sidebarMax = SIDEBAR_MAX_WIDTH[breakpoint];
	const middleMin = MIDDLE_MIN_WIDTH[breakpoint];
	const middleMax = MIDDLE_MAX_WIDTH[breakpoint];

	const maxSidebarArea = useMemo(() => {
		if (!availableWidth) {
			return null;
		}
		return Math.max(availableWidth - rightPanelWidth - minChatWidth, 0);
	}, [availableWidth, minChatWidth, rightPanelWidth]);

	const clampWidth = useCallback((value: number, min: number, max: number) => {
		return Math.min(max, Math.max(min, value));
	}, []);

	const maxSidebarTotal = maxSidebarArea ?? baseSidebarWidth + baseMiddleWidth;
	const effectiveSidebarMax = Math.min(sidebarMax, maxSidebarTotal - middleMin);
	const effectiveMiddleMax = Math.min(middleMax, maxSidebarTotal - sidebarMin);

	const sidebarInitial = clampWidth(
		baseSidebarWidth,
		sidebarMin,
		effectiveSidebarMax,
	);
	const middleInitial = clampWidth(
		baseMiddleWidth,
		middleMin,
		effectiveMiddleMax,
	);
	const sidebarWidth = useSharedValue(sidebarInitial);
	const middleWidth = useSharedValue(middleInitial);
	const startSidebarWidth = useSharedValue(sidebarInitial);
	const startMiddleWidth = useSharedValue(middleInitial);

	useEffect(() => {
		const maxLeft = Math.max(sidebarMin, maxSidebarTotal - middleMin);
		const maxMiddle = Math.max(middleMin, maxSidebarTotal - sidebarMin);
		const nextSidebar = clampWidth(sidebarWidth.value, sidebarMin, maxLeft);
		const nextMiddle = clampWidth(middleWidth.value, middleMin, maxMiddle);
		const total = nextSidebar + nextMiddle;

		if (total > maxSidebarTotal) {
			const overflow = total - maxSidebarTotal;
			const adjustedMiddle = Math.max(middleMin, nextMiddle - overflow);
			const remainingOverflow = overflow - (nextMiddle - adjustedMiddle);
			const adjustedSidebar = Math.max(
				sidebarMin,
				nextSidebar - remainingOverflow,
			);
			sidebarWidth.value = adjustedSidebar;
			middleWidth.value = adjustedMiddle;
			return;
		}

		sidebarWidth.value = nextSidebar;
		middleWidth.value = nextMiddle;
	}, [
		maxSidebarTotal,
		middleMin,
		sidebarMin,
		sidebarWidth,
		middleWidth,
		clampWidth,
	]);

	const leftHandle = useMemo(() => {
		const maxLeft = Math.max(sidebarMin, maxSidebarTotal - middleMin);

		return Gesture.Pan()
			.hitSlop(12)
			.activeOffsetX([-8, 8])
			.shouldCancelWhenOutside(false)
			.onBegin(() => {
				startSidebarWidth.value = sidebarWidth.value;
			})
			.onChange((event) => {
				const nextWidth = clampWidth(
					startSidebarWidth.value + event.translationX,
					sidebarMin,
					maxLeft,
				);
				sidebarWidth.value = nextWidth;
			});
	}, [
		maxSidebarTotal,
		middleMin,
		sidebarMin,
		sidebarWidth,
		startSidebarWidth,
		clampWidth,
	]);

	const middleHandle = useMemo(() => {
		const maxMiddle = Math.max(middleMin, maxSidebarTotal - sidebarMin);

		return Gesture.Pan()
			.hitSlop(12)
			.activeOffsetX([-8, 8])
			.shouldCancelWhenOutside(false)
			.onBegin(() => {
				startMiddleWidth.value = middleWidth.value;
			})
			.onChange((event) => {
				const nextWidth = clampWidth(
					startMiddleWidth.value + event.translationX,
					middleMin,
					maxMiddle,
				);
				middleWidth.value = nextWidth;
			});
	}, [
		maxSidebarTotal,
		middleMin,
		sidebarMin,
		middleWidth,
		startMiddleWidth,
		clampWidth,
	]);

	const sidebarStyle = useAnimatedStyle(() => ({
		width: sidebarWidth.value,
	}));

	const middleStyle = useAnimatedStyle(() => ({
		width: middleWidth.value,
	}));

	const frameClassName = isFramed
		? "overflow-hidden rounded-xl border border-border bg-background"
		: "flex-1 bg-background";

	return (
		<View className={frameClassName} style={height ? { height } : undefined}>
			<TopBar />
			<View className="flex-1 flex-row">
				<Animated.View
					className="border-border border-r bg-background"
					style={sidebarStyle}
				>
					<WorkspaceSidebarContent
						rowHeight={rowHeight}
						selectedWorkspaceId={selectedWorkspaceId ?? null}
						selectedProjectId={selectedProjectId ?? null}
						onSelectProject={onSelectProject ?? (() => {})}
						onSelectWorkspace={onSelectWorkspace ?? (() => {})}
						onCreateWorkspace={onCreateWorkspace}
					/>
				</Animated.View>
				<ResizeHandle gesture={leftHandle} />
				<Animated.View
					className="border-border border-r bg-background"
					style={middleStyle}
				>
					<SessionSidebarContent
						rowHeight={rowHeight}
						sessions={sessions}
						selectedSessionId={resolvedSelectedSessionId}
						onSelectSession={handleSelectSession}
						onCreateSession={handleCreateSession}
						listState={sessionListState}
						noProjectSelected={!hasDirectory}
					/>
				</Animated.View>
				<ResizeHandle gesture={middleHandle} />
				<ChatPanel sessionTitle={resolvedSelectedSessionId ?? undefined} />
				{showRightPanel && (
					<InfoSidebar width={RIGHT_PANEL_WIDTH} sessions={sessions} />
				)}
			</View>
		</View>
	);
}

export function LogoEmptyState({
	title,
	subtitle,
}: {
	title: string;
	subtitle: string;
}) {
	const { mode } = useTheme();

	return (
		<View className="items-center gap-4 rounded-2xl border border-border bg-surface px-5 py-6">
			<Logo mode={mode} width={140} height={28} />
			<View className="items-center gap-2">
				<AppText className="font-semibold text-base text-foreground-strong">
					{title}
				</AppText>
				<AppText className="text-center text-foreground-weak text-sm">
					{subtitle}
				</AppText>
			</View>
			<View className="w-full gap-3">
				{emptyStateActions.map((action, index) => (
					<Button
						key={action}
						variant={index === 0 ? "secondary" : "outline"}
						size="md"
						className="w-full"
					>
						{action}
					</Button>
				))}
			</View>
		</View>
	);
}

function TopBar() {
	const { mode } = useTheme();

	return (
		<View className="flex-row items-center justify-between border-border border-b bg-surface-strong px-4 py-3">
			<View className="flex-row items-center gap-3">
				<Logo mode={mode} width={120} height={24} />
			</View>
			<View className="flex-row items-center gap-3">
				<View className="flex-row items-center gap-2 rounded-full border border-border bg-surface px-3 py-1">
					<View className="h-2 w-2 rounded-full bg-surface-success" />
					<AppText className="text-foreground-weak text-xs">Synced</AppText>
				</View>
				<View className="h-8 w-8 items-center justify-center rounded-full bg-surface-weak">
					<AppText className="font-semibold text-foreground-strong text-xs">
						AC
					</AppText>
				</View>
			</View>
		</View>
	);
}

function WorkspaceProjectsList({
	workspaceId,
	selectedProjectId,
	rowHeight,
	onSelectProject,
}: {
	workspaceId: string | null;
	selectedProjectId: string | null;
	rowHeight: number;
	onSelectProject: (id: string, worktree?: string) => void;
}) {
	const { projectGroups, isLoading, isError, error } =
		useOpenCodeProjects(workspaceId);

	return (
		<ProjectsListContent
			projectGroups={projectGroups}
			isLoading={isLoading}
			isError={isError}
			error={error}
			selectedProjectId={selectedProjectId}
			onSelectProject={onSelectProject}
			variant="sidebar"
			rowHeight={rowHeight}
		/>
	);
}

function WorkspaceSidebarContent({
	rowHeight,
	workspaceGroups,
	selectedWorkspaceId,
	selectedProjectId,
	onSelectProject,
	onSelectWorkspace,
	onCreateWorkspace,
	listState = "ready",
}: {
	rowHeight: number;
	workspaceGroups?: WorkspaceGroup[];
	selectedWorkspaceId: string | null;
	selectedProjectId: string | null;
	onSelectProject: (id: string, worktree?: string) => void;
	onSelectWorkspace: (id: string) => void;
	onCreateWorkspace?: () => void;
	listState?: ListState;
}) {
	const resolvedWorkspaceGroups = workspaceGroups ?? workspaceGroupsSeed;
	const [expandedWorkspaceId, setExpandedWorkspaceId] = useState<string | null>(
		null,
	);

	useEffect(() => {
		if (selectedWorkspaceId) {
			const selectedWorkspaceName = resolvedWorkspaceGroups
				.flatMap((group) => group.rows)
				.find((row) => (row.id ?? row.name) === selectedWorkspaceId)?.name;
			if (
				selectedWorkspaceName &&
				selectedWorkspaceName !== expandedWorkspaceId
			) {
				setExpandedWorkspaceId(selectedWorkspaceName);
			}
		}
	}, [selectedWorkspaceId, resolvedWorkspaceGroups, expandedWorkspaceId]);

	const handleWorkspacePress = useCallback(
		(workspaceId: string) => {
			onSelectWorkspace(workspaceId);
		},
		[onSelectWorkspace],
	);
	const handleWorkspaceToggle = useCallback((workspaceName: string) => {
		setExpandedWorkspaceId((prev) =>
			prev === workspaceName ? null : workspaceName,
		);
	}, []);

	const workspaceRows = useMemo(
		() =>
			resolvedWorkspaceGroups.flatMap((group) =>
				group.rows.map((row) => ({
					...row,
					ownerInitials: group.ownerInitials,
				})),
			),
		[resolvedWorkspaceGroups],
	);

	return (
		<View className="flex-1">
			<ListHeader
				title="Workspaces"
				actionLabel="New"
				onPress={onCreateWorkspace}
			/>
			{listState === "error" && (
				<View className="px-3 pt-3">
					<ErrorBanner
						title="Sync issue"
						subtitle="Unable to load workspaces."
						ctaLabel="Retry"
					/>
				</View>
			)}
			{listState === "loading" && (
				<LoadingList count={6} rowHeight={rowHeight} />
			)}
			{listState === "empty" && (
				<View className="px-3 pt-3">
					<EmptyStateCard
						title="No workspaces yet"
						subtitle="Create your first workspace to get started."
						ctaLabel="Create workspace"
						onPress={onCreateWorkspace}
					/>
				</View>
			)}
			{listState === "ready" && (
				<FlatList
					data={workspaceRows}
					keyExtractor={(item) => item.name}
					style={{ flex: 1 }}
					contentContainerStyle={{ paddingBottom: 12 }}
					renderItem={({ item: row }) => {
						const isSelected = (row.id ?? row.name) === selectedWorkspaceId;
						const isExpanded = row.name === expandedWorkspaceId;

						return (
							<View>
								<WorkspaceAccordionTrigger
									row={row}
									ownerInitials={row.ownerInitials}
									rowHeight={rowHeight}
									isSelected={isSelected}
									isExpanded={isExpanded}
									onPress={() => {
										handleWorkspacePress(row.id ?? row.name);
										handleWorkspaceToggle(row.name);
									}}
									onToggle={() => handleWorkspaceToggle(row.name)}
								/>
								{isExpanded && (
									<WorkspaceProjectsList
										workspaceId={row.id ?? null}
										selectedProjectId={selectedProjectId}
										rowHeight={rowHeight}
										onSelectProject={onSelectProject}
									/>
								)}
							</View>
						);
					}}
				/>
			)}
		</View>
	);
}

function WorkspaceAccordionTrigger({
	row,
	ownerInitials,
	rowHeight,
	isSelected,
	isExpanded,
	onPress,
	onToggle,
}: {
	row: WorkspaceGroup["rows"][number];
	ownerInitials: string;
	rowHeight: number;
	isSelected: boolean;
	isExpanded: boolean;
	onPress: () => void;
	onToggle: () => void;
}) {
	return (
		<View className="flex-row items-center py-2">
			<WorkspaceCard
				row={row}
				ownerInitials={ownerInitials}
				rowHeight={rowHeight}
				isSelected={isSelected}
				onPress={onPress}
			/>
			<Pressable
				onPress={onToggle}
				className="focus-ring ml-2 h-8 w-8 items-center justify-center rounded-full"
				accessibilityRole="button"
				accessibilityState={{ expanded: isExpanded }}
				accessibilityLabel={isExpanded ? "Collapse" : "Expand"}
			>
				<Animated.View
					className="items-center justify-center"
					style={{
						transform: [{ rotate: isExpanded ? "-180deg" : "0deg" }],
					}}
				>
					<Feather name="chevron-down" size={18} color="var(--color-icon)" />
				</Animated.View>
			</Pressable>
		</View>
	);
}

function SessionSidebarContent({
	rowHeight,
	sessions,
	selectedSessionId,
	onSelectSession,
	onCreateSession,
	listState = "ready",
	noProjectSelected = false,
}: {
	rowHeight: number;
	sessions: RealSessionRowData[];
	selectedSessionId: string | null;
	onSelectSession: (sessionId: string) => void;
	onCreateSession: () => void;
	listState?: ListState;
	noProjectSelected?: boolean;
}) {
	return (
		<View className="flex-1">
			<ListHeader
				title="Sessions"
				actionLabel="New"
				onPress={onCreateSession}
			/>
			{listState === "error" && (
				<View className="px-3 pt-3">
					<ErrorCard
						title="Server offline"
						subtitle="Open Code server is unreachable."
						ctaLabel="Retry"
						secondaryLabel="Open server"
					/>
				</View>
			)}
			{listState === "loading" && (
				<LoadingList count={5} rowHeight={rowHeight} />
			)}
			{listState === "empty" && (
				<View className="px-3 pt-3">
					<EmptyStateCard
						title={
							noProjectSelected ? "Select a project first" : "No sessions yet"
						}
						subtitle={
							noProjectSelected
								? "Choose a project to view its sessions."
								: "Create a session to start chatting."
						}
						ctaLabel={noProjectSelected ? undefined : "New session"}
						onPress={noProjectSelected ? undefined : onCreateSession}
					/>
				</View>
			)}
			{listState === "ready" && (
				<FlatList
					data={sessions}
					keyExtractor={(item) => item.id}
					style={{ flex: 1 }}
					contentContainerStyle={{
						paddingHorizontal: 12,
						paddingTop: 12,
						paddingBottom: 12,
					}}
					ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
					renderItem={({ item: session }) => (
						<SessionRow
							title={session.name}
							status={session.status}
							lastUsed={session.lastUsed}
							height={rowHeight}
							isActive={session.id === selectedSessionId}
							onPress={() => onSelectSession(session.id)}
						/>
					)}
				/>
			)}
		</View>
	);
}

export function ChatPanel({
	sessionTitle,
	messageState = "ready",
}: {
	sessionTitle?: string;
	messageState?: ListState;
}) {
	return (
		<View className="flex-1 bg-background">
			<View className="border-border border-b bg-surface px-4 py-3">
				<AppText className="font-semibold text-base text-foreground-strong">
					{sessionTitle ?? "Session"}
				</AppText>
			</View>
			<View className="flex-1 gap-3 p-4">
				<BuildBanner />
				{messageState === "loading" && (
					<View className="flex-1 items-center justify-center">
						<ActivityIndicator color="var(--color-icon)" />
					</View>
				)}
				{messageState === "empty" && (
					<EmptyStateCard
						title="No messages yet"
						subtitle="Start a session to see messages here."
						ctaLabel="New session"
					/>
				)}
				{messageState === "ready" &&
					messageRows.map((message, index) => (
						<View
							key={`${message.role}-${index}`}
							className={`rounded-xl px-3 py-2 ${
								message.role === "user"
									? "self-end bg-surface-interactive"
									: "self-start bg-surface"
							}`}
							style={{ maxWidth: "70%" }}
						>
							<AppText className="text-foreground text-sm">
								{message.text}
							</AppText>
						</View>
					))}
			</View>
			<View className="border-border border-t bg-surface px-4 py-3">
				<View className="flex-row items-center gap-2 rounded-xl border border-border bg-input px-3 py-2">
					<AppText className="text-foreground-weak text-sm">Message...</AppText>
					<View className="ml-auto">
						<Feather name="send" size={14} color="var(--color-icon)" />
					</View>
				</View>
			</View>
		</View>
	);
}

export function InfoSidebar({
	width,
	sessions,
}: {
	width: number;
	sessions: SessionRowData[];
}) {
	return (
		<View className="border-border border-l bg-background" style={{ width }}>
			<View className="gap-3 p-3">
				<InfoCard title="Workspace status">
					<View className="gap-2">
						<StatusLine label="Builds" value="2 active" />
						<StatusLine label="Sessions" value="4 live" />
						<StatusLine label="Alerts" value="1 pending" />
					</View>
				</InfoCard>
				<InfoCard title="Session focus">
					<View className="gap-2">
						{sessions.slice(0, 2).map((session) => (
							<View key={session.name} className="gap-1">
								<AppText className="text-foreground-strong text-sm">
									{session.name}
								</AppText>
								<AppText className="text-foreground-weak text-xs">
									{session.status} · {session.lastUsed}
								</AppText>
							</View>
						))}
					</View>
				</InfoCard>
				<LogoEmptyState
					title="Bring the team in"
					subtitle="Add teammates and connect repos to unlock shared sessions."
				/>
			</View>
		</View>
	);
}

function ListHeader({
	title,
	actionLabel,
	onPress,
}: {
	title: string;
	actionLabel: string;
	onPress?: () => void;
}) {
	return (
		<View className="flex-row items-center justify-between border-border border-b px-3 py-3">
			<AppText className="font-semibold text-foreground-strong text-sm">
				{title}
			</AppText>
			<Button size="sm" variant="outline" onPress={onPress}>
				{actionLabel}
			</Button>
		</View>
	);
}

function ResizeHandle({
	gesture,
}: {
	gesture: ReturnType<typeof Gesture.Pan>;
}) {
	return (
		<GestureDetector gesture={gesture}>
			<View
				style={{ width: RESIZE_HANDLE_WIDTH, pointerEvents: "box-only" }}
				className="items-center justify-center bg-border"
			>
				<View className="h-10 w-1 rounded-full bg-border" />
			</View>
		</GestureDetector>
	);
}

function SessionRow({
	title,
	status,
	lastUsed,
	height,
	isActive,
	onPress,
}: {
	title: string;
	status: string;
	lastUsed: string;
	height: number;
	isActive?: boolean;
	onPress?: () => void;
}) {
	return (
		<Pressable
			onPress={onPress}
			className={`focus-ring justify-center rounded-xl px-3 ${
				isActive ? "bg-surface" : "bg-transparent"
			}`}
			style={{ height }}
			accessibilityRole="button"
			accessibilityLabel={`${title} session`}
		>
			<View className="flex-row items-center justify-between">
				<AppText className="text-foreground-strong text-sm">{title}</AppText>
				<AppText className="text-foreground-weak text-xs">{status}</AppText>
			</View>
			<AppText className="text-foreground-weak text-xs">
				Updated {lastUsed}
			</AppText>
		</Pressable>
	);
}

function BuildBanner() {
	return (
		<View className="gap-1 rounded-xl border border-border-info bg-surface-info px-3 py-2">
			<View className="flex-row items-center justify-between">
				<View className="flex-row items-center gap-2">
					<View className="h-2 w-2 rounded-full bg-surface-info" />
					<AppText className="font-semibold text-foreground-strong text-xs">
						{buildStatus.title}
					</AppText>
				</View>
				<AppText className="text-foreground-weak text-xs">
					{buildStatus.detail}
				</AppText>
			</View>
			<AppText className="text-foreground-weak text-xs">
				{buildStatus.stage}
			</AppText>
		</View>
	);
}

function InfoCard({ title, children }: { title: string; children: ReactNode }) {
	return (
		<View className="gap-2 rounded-xl border border-border bg-surface px-3 py-3">
			<AppText className="font-semibold text-foreground-strong text-sm">
				{title}
			</AppText>
			{children}
		</View>
	);
}

function StatusLine({ label, value }: { label: string; value: string }) {
	return (
		<View className="flex-row items-center justify-between">
			<AppText className="text-foreground-weak text-xs">{label}</AppText>
			<AppText className="text-foreground-strong text-xs">{value}</AppText>
		</View>
	);
}

function ErrorCard({
	title,
	subtitle,
	ctaLabel,
	secondaryLabel,
}: {
	title: string;
	subtitle: string;
	ctaLabel: string;
	secondaryLabel?: string;
}) {
	return (
		<View className="gap-2 rounded-xl border border-border-critical bg-surface-critical px-3 py-3">
			<View className="flex-row items-center gap-2">
				<Feather name="alert-triangle" size={14} color="var(--color-icon)" />
				<AppText className="font-semibold text-foreground-strong text-sm">
					{title}
				</AppText>
			</View>
			<AppText className="text-foreground-weak text-xs">{subtitle}</AppText>
			<View className="flex-row gap-2">
				<Button size="sm" variant="outline" accessibilityLabel={ctaLabel}>
					{ctaLabel}
				</Button>
				{secondaryLabel && (
					<Button
						size="sm"
						variant="secondary"
						accessibilityLabel={secondaryLabel}
					>
						{secondaryLabel}
					</Button>
				)}
			</View>
		</View>
	);
}

export function AppShell({
	breakpoint,
	showRightPanel = true,
	height,
	availableWidth,
	isFramed = true,
	workspaceGroups,
	onCreateWorkspace,
	listState = "ready",
}: {
	breakpoint: BreakpointName;
	showRightPanel?: boolean;
	height?: number;
	availableWidth?: number;
	isFramed?: boolean;
	workspaceGroups: WorkspaceGroup[];
	onCreateWorkspace?: () => void;
	listState?: ListState;
}) {
	const {
		selectedWorkspaceId,
		selectedProjectId,
		selectedProjectWorktree,
		selectedSessionId,
	} = useWorkspaceNav();

	const { navigateToWorkspace, navigateToProject, navigateToSession } =
		useWorkspaceNavigation();

	const {
		sessions: realSessions,
		isLoading: sessionsLoading,
		isError: sessionsError,
		hasDirectory,
	} = useOpenCodeSessions(
		selectedWorkspaceId,
		selectedProjectWorktree ?? undefined,
	);

	const createSession = useCreateSession(selectedWorkspaceId);

	const getSessionListState = (): ListState | "no-project" => {
		if (!hasDirectory) return "no-project";
		if (sessionsLoading) return "loading";
		if (sessionsError) return "error";
		if (realSessions.length === 0) return "empty";
		return "ready";
	};

	const sessionListState = getSessionListState();
	const sessions: RealSessionRowData[] =
		sessionListState === "ready" ? realSessions : [];

	const handleSelectSession = (sessionId: string) => {
		navigateToSession(sessionId);
	};

	const handleCreateSession = async () => {
		if (!selectedProjectWorktree) return;
		try {
			const newSession = await createSession.mutateAsync({
				directory: selectedProjectWorktree,
			});
			navigateToSession(newSession.id);
		} catch {}
	};

	const rowHeight = ROW_HEIGHTS[breakpoint];
	const baseSidebarWidth = SIDEBAR_WIDTHS[breakpoint];
	const baseMiddleWidth = breakpoint === "desktop" ? 260 : 220;
	const minChatWidth = breakpoint === "desktop" ? 320 : 260;
	const rightPanelWidth = showRightPanel ? RIGHT_PANEL_WIDTH : 0;

	const sidebarMin = SIDEBAR_MIN_WIDTH[breakpoint];
	const sidebarMax = SIDEBAR_MAX_WIDTH[breakpoint];
	const middleMin = MIDDLE_MIN_WIDTH[breakpoint];
	const middleMax = MIDDLE_MAX_WIDTH[breakpoint];

	const maxSidebarArea = useMemo(() => {
		if (!availableWidth) {
			return null;
		}
		return Math.max(availableWidth - rightPanelWidth - minChatWidth, 0);
	}, [availableWidth, minChatWidth, rightPanelWidth]);

	const clampWidth = useCallback((value: number, min: number, max: number) => {
		return Math.min(max, Math.max(min, value));
	}, []);

	const maxSidebarTotal = maxSidebarArea ?? baseSidebarWidth + baseMiddleWidth;
	const effectiveSidebarMax = Math.min(sidebarMax, maxSidebarTotal - middleMin);
	const effectiveMiddleMax = Math.min(middleMax, maxSidebarTotal - sidebarMin);

	const sidebarInitial = clampWidth(
		baseSidebarWidth,
		sidebarMin,
		effectiveSidebarMax,
	);
	const middleInitial = clampWidth(
		baseMiddleWidth,
		middleMin,
		effectiveMiddleMax,
	);
	const sidebarWidth = useSharedValue(sidebarInitial);
	const middleWidth = useSharedValue(middleInitial);
	const startSidebarWidth = useSharedValue(sidebarInitial);
	const startMiddleWidth = useSharedValue(middleInitial);

	useEffect(() => {
		const maxLeft = Math.max(sidebarMin, maxSidebarTotal - middleMin);
		const maxMiddle = Math.max(middleMin, maxSidebarTotal - sidebarMin);
		const nextSidebar = clampWidth(sidebarWidth.value, sidebarMin, maxLeft);
		const nextMiddle = clampWidth(middleWidth.value, middleMin, maxMiddle);
		const total = nextSidebar + nextMiddle;

		if (total > maxSidebarTotal) {
			const overflow = total - maxSidebarTotal;
			const adjustedMiddle = Math.max(middleMin, nextMiddle - overflow);
			const remainingOverflow = overflow - (nextMiddle - adjustedMiddle);
			const adjustedSidebar = Math.max(
				sidebarMin,
				nextSidebar - remainingOverflow,
			);
			sidebarWidth.value = adjustedSidebar;
			middleWidth.value = adjustedMiddle;
			return;
		}

		sidebarWidth.value = nextSidebar;
		middleWidth.value = nextMiddle;
	}, [
		maxSidebarTotal,
		middleMin,
		sidebarMin,
		sidebarWidth,
		middleWidth,
		clampWidth,
	]);

	const leftHandle = useMemo(() => {
		const maxLeft = Math.max(sidebarMin, maxSidebarTotal - middleMin);

		return Gesture.Pan()
			.hitSlop(12)
			.activeOffsetX([-8, 8])
			.shouldCancelWhenOutside(false)
			.onBegin(() => {
				startSidebarWidth.value = sidebarWidth.value;
			})
			.onChange((event) => {
				const nextWidth = clampWidth(
					startSidebarWidth.value + event.translationX,
					sidebarMin,
					maxLeft,
				);
				sidebarWidth.value = nextWidth;
			});
	}, [
		maxSidebarTotal,
		middleMin,
		sidebarMin,
		sidebarWidth,
		startSidebarWidth,
		clampWidth,
	]);

	const middleHandle = useMemo(() => {
		const maxMiddle = Math.max(middleMin, maxSidebarTotal - sidebarMin);

		return Gesture.Pan()
			.hitSlop(12)
			.activeOffsetX([-8, 8])
			.shouldCancelWhenOutside(false)
			.onBegin(() => {
				startMiddleWidth.value = middleWidth.value;
			})
			.onChange((event) => {
				const nextWidth = clampWidth(
					startMiddleWidth.value + event.translationX,
					middleMin,
					maxMiddle,
				);
				middleWidth.value = nextWidth;
			});
	}, [
		maxSidebarTotal,
		middleMin,
		sidebarMin,
		middleWidth,
		startMiddleWidth,
		clampWidth,
	]);

	const sidebarStyle = useAnimatedStyle(() => ({
		width: sidebarWidth.value,
	}));

	const middleStyle = useAnimatedStyle(() => ({
		width: middleWidth.value,
	}));

	const frameClassName = isFramed
		? "overflow-hidden rounded-xl border border-border bg-background"
		: "flex-1 bg-background";

	return (
		<View className={frameClassName} style={height ? { height } : undefined}>
			<TopBar />
			<View className="flex-1 flex-row">
				<Animated.View
					className="border-border border-r bg-background"
					style={sidebarStyle}
				>
					<WorkspaceSidebarContent
						rowHeight={rowHeight}
						workspaceGroups={workspaceGroups}
						selectedWorkspaceId={selectedWorkspaceId}
						selectedProjectId={selectedProjectId}
						onSelectProject={navigateToProject}
						onSelectWorkspace={navigateToWorkspace}
						onCreateWorkspace={onCreateWorkspace}
						listState={listState}
					/>
				</Animated.View>
				<ResizeHandle gesture={leftHandle} />
				<Animated.View
					className="border-border border-r bg-background"
					style={middleStyle}
				>
					<SessionSidebarContent
						rowHeight={rowHeight}
						sessions={sessions}
						selectedSessionId={selectedSessionId}
						onSelectSession={handleSelectSession}
						onCreateSession={handleCreateSession}
						listState={
							sessionListState === "no-project"
								? "empty"
								: sessionListState === "ready"
									? "ready"
									: sessionListState
						}
						noProjectSelected={!hasDirectory}
					/>
				</Animated.View>
				<ResizeHandle gesture={middleHandle} />
				<ChatPanel
					sessionTitle={selectedSessionId ?? undefined}
					messageState={listState}
				/>
				{showRightPanel && (
					<InfoSidebar width={RIGHT_PANEL_WIDTH} sessions={sessions} />
				)}
			</View>
		</View>
	);
}
