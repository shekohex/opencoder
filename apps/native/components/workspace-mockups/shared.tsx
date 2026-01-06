import { Feather } from "@expo/vector-icons";
import { Logo } from "@opencoder/branding";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	type FlatListProps,
	type LayoutChangeEvent,
	Pressable,
	type StyleProp,
	View,
	type ViewStyle,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated";
import { Accordion } from "@/components/accordion";
import {
	AccordionContext,
	useAccordionContext,
	useAccordionItemContext,
} from "@/components/accordion.shared";
import { AppText } from "@/components/app-text";
import { Button } from "@/components/button";
import { WorkspaceCard } from "@/components/workspace-mockups/workspace-card";
import { useTheme } from "@/lib/theme-context";
import { useWorkspaceNav } from "@/lib/workspace-nav";

import {
	buildStatus,
	emptyStateActions,
	messageRows,
	projectGroups,
	sessionRows,
	workspaceGroups as workspaceGroupsSeed,
} from "./mock-data";

export type BreakpointName = "desktop" | "tablet";
export type ListState = "ready" | "loading" | "empty" | "error";

type WorkspaceGroup = (typeof workspaceGroupsSeed)[number];

export const ROW_HEIGHTS = {
	desktop: 64,
	tablet: 60,
	mobile: 56,
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

const RIGHT_PANEL_WIDTH = 240;
const RESIZE_HANDLE_WIDTH = 10;

type SessionRowData = (typeof sessionRows)[number];

type AccordionCellRendererProps<T> = {
	children?: ReactNode;
	item: T;
	index: number;
	style?: StyleProp<ViewStyle>;
	onLayout?: (event: LayoutChangeEvent) => void;
};

const cloneWorkspaceGroups = (groups: WorkspaceGroup[]) =>
	groups.map((group) => ({
		...group,
		rows: group.rows.map((row) => ({
			...row,
			badges: [...row.badges],
		})),
	}));

const getHasActiveBuilds = (groups: WorkspaceGroup[]) =>
	groups.some((group) =>
		group.rows.some((row) => {
			const status = row.status.toLowerCase();
			return status.includes("starting") || status.includes("building");
		}),
	);

export function useWorkspacePolling() {
	const [workspaceGroups, setWorkspaceGroups] = useState(() =>
		cloneWorkspaceGroups(workspaceGroupsSeed),
	);
	const hasActiveBuilds = useMemo(
		() => getHasActiveBuilds(workspaceGroups),
		[workspaceGroups],
	);
	const intervalMs = hasActiveBuilds ? 5000 : 30000;

	useEffect(() => {
		const intervalId = setInterval(() => {
			setWorkspaceGroups((prev) => cloneWorkspaceGroups(prev));
			console.log(`[workspaces] refresh ${intervalMs}ms`);
		}, intervalMs);

		return () => clearInterval(intervalId);
	}, [intervalMs]);

	return { workspaceGroups, hasActiveBuilds, intervalMs };
}

function buildNewSession(sessions: SessionRowData[]) {
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
	onSelectProject?: (projectId: string) => void;
	onSelectWorkspace?: (workspaceId: string) => void;
	onCreateWorkspace?: () => void;
	selectedSessionId?: string | null;
	onSelectSession?: (sessionId: string) => void;
}) {
	const [sessions, setSessions] = useState(sessionRows);
	const [localSelectedSessionId, setLocalSelectedSessionId] = useState<
		string | null
	>(null);
	const resolvedSelectedSessionId = selectedSessionId ?? localSelectedSessionId;

	const handleSelectSession = (sessionId: string) => {
		if (onSelectSession) {
			onSelectSession(sessionId);
			return;
		}
		setLocalSelectedSessionId(sessionId);
	};

	const handleCreateSession = () => {
		const nextSession = buildNewSession(sessions);
		setSessions((prev) => [...prev, nextSession]);
		handleSelectSession(nextSession.name);
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

	const sidebarWidth = useSharedValue(
		clampWidth(baseSidebarWidth, sidebarMin, effectiveSidebarMax),
	);
	const middleWidth = useSharedValue(
		clampWidth(baseMiddleWidth, middleMin, effectiveMiddleMax),
	);
	const startSidebarWidth = useSharedValue(sidebarWidth.value);
	const startMiddleWidth = useSharedValue(middleWidth.value);

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
		<View className="items-center gap-3 rounded-xl border border-border bg-surface px-4 py-5">
			<Logo mode={mode} width={140} height={28} />
			<View className="items-center gap-1">
				<AppText className="font-semibold text-foreground-strong text-sm">
					{title}
				</AppText>
				<AppText className="text-center text-foreground-weak text-xs">
					{subtitle}
				</AppText>
			</View>
			<View className="w-full gap-2">
				{emptyStateActions.map((action, index) => (
					<Button
						key={action}
						variant={index === 0 ? "secondary" : "outline"}
						size="sm"
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

function AccordionVirtualizedList<T>(props: FlatListProps<T>) {
	const accordionContext = useAccordionContext();

	const cellRenderer = useCallback(
		(cellProps: AccordionCellRendererProps<T>) => {
			const { children, style, onLayout } = cellProps;

			return (
				<AccordionContext.Provider value={accordionContext}>
					<View style={style} onLayout={onLayout}>
						{children}
					</View>
				</AccordionContext.Provider>
			);
		},
		[accordionContext],
	);

	const { CellRendererComponent: _CellRendererComponent, ...rest } = props;

	return <FlatList {...rest} CellRendererComponent={cellRenderer} />;
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
	onSelectProject: (id: string) => void;
	onSelectWorkspace: (id: string) => void;
	onCreateWorkspace?: () => void;
	listState?: ListState;
}) {
	const resolvedWorkspaceGroups = workspaceGroups ?? workspaceGroupsSeed;
	const handleWorkspacePress = useCallback(
		(workspaceName: string) => {
			onSelectWorkspace(workspaceName);
		},
		[onSelectWorkspace],
	);

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
				<Accordion type="single" collapsible>
					<AccordionVirtualizedList
						data={workspaceRows}
						keyExtractor={(item) => item.name}
						style={{ flex: 1 }}
						contentContainerStyle={{ paddingBottom: 12 }}
						renderItem={({ item: row }) => {
							const isSelected = row.name === selectedWorkspaceId;
							const workspaceValue = `workspace-${row.name}`;

							return (
								<Accordion.Item key={workspaceValue} value={workspaceValue}>
									<WorkspaceAccordionTrigger
										row={row}
										ownerInitials={row.ownerInitials}
										rowHeight={rowHeight}
										isSelected={isSelected}
										onPress={() => handleWorkspacePress(row.name)}
									/>
									<Accordion.Content>
										<View className="ml-4 gap-3 border-border border-l pb-2 pl-4">
											{projectGroups.map((projectGroup) => (
												<View key={projectGroup.title} className="gap-1">
													<AppText className="text-foreground-weak text-xs uppercase">
														{projectGroup.title}
													</AppText>
													{projectGroup.rows.map((project) => {
														const projectKey = `${row.name}-${project.name}`;
														const isProjectSelected =
															project.name === selectedProjectId;

														return (
															<ProjectRow
																key={projectKey}
																name={project.name}
																status={project.status}
																lastUsed={project.lastUsed}
																height={Math.max(rowHeight - 8, 40)}
																isSelected={isProjectSelected}
																onPress={() => onSelectProject(project.name)}
															/>
														);
													})}
												</View>
											))}
										</View>
									</Accordion.Content>
								</Accordion.Item>
							);
						}}
					/>
				</Accordion>
			)}
		</View>
	);
}

function WorkspaceAccordionTrigger({
	row,
	ownerInitials,
	rowHeight,
	isSelected,
	onPress,
}: {
	row: WorkspaceGroup["rows"][number];
	ownerInitials: string;
	rowHeight: number;
	isSelected: boolean;
	onPress: () => void;
}) {
	const { isExpanded, toggle } = useAccordionItemContext();

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
				onPress={toggle}
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
}: {
	rowHeight: number;
	sessions: SessionRowData[];
	selectedSessionId: string | null;
	onSelectSession: (sessionId: string) => void;
	onCreateSession: () => void;
	listState?: ListState;
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
						title="No sessions yet"
						subtitle="Create a session to start chatting."
						ctaLabel="New session"
						onPress={onCreateSession}
					/>
				</View>
			)}
			{listState === "ready" && (
				<FlatList
					data={sessions}
					keyExtractor={(item) => item.name}
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
							isActive={session.name === selectedSessionId}
							onPress={() => onSelectSession(session.name)}
						/>
					)}
				/>
			)}
		</View>
	);
}

function ChatPanel({
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
							className={`rounded-lg px-3 py-2 ${
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
				<View className="flex-row items-center gap-2 rounded-lg border border-border bg-input px-3 py-2">
					<AppText className="text-foreground-weak text-sm">Message...</AppText>
					<View className="ml-auto">
						<Feather name="send" size={14} color="var(--color-icon)" />
					</View>
				</View>
			</View>
		</View>
	);
}

function InfoSidebar({
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
				pointerEvents="box-only"
				style={{ width: RESIZE_HANDLE_WIDTH }}
				className="items-center justify-center bg-border"
			>
				<View className="h-10 w-1 rounded-full bg-border" />
			</View>
		</GestureDetector>
	);
}

function ProjectRow({
	name,
	status,
	lastUsed,
	height,
	isSelected,
	onPress,
}: {
	name: string;
	status: string;
	lastUsed: string;
	height: number;
	isSelected?: boolean;
	onPress?: () => void;
}) {
	return (
		<Pressable
			onPress={onPress}
			className={`focus-ring justify-center rounded-lg px-3 ${
				isSelected ? "bg-surface" : "bg-transparent"
			}`}
			style={{ height }}
			accessibilityRole="button"
			accessibilityLabel={`${name} project`}
		>
			<View className="flex-row items-center justify-between">
				<AppText className="text-foreground-strong text-sm">{name}</AppText>
				<AppText className="text-foreground-weak text-xs">{status}</AppText>
			</View>
			<AppText className="text-foreground-weak text-xs">
				Updated {lastUsed}
			</AppText>
		</Pressable>
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
			className={`focus-ring justify-center rounded-lg px-3 ${
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
		<View className="gap-1 rounded-lg border border-border-info bg-surface-info px-3 py-2">
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
		<View className="gap-2 rounded-lg border border-border-critical bg-surface-critical px-3 py-3">
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

export function ErrorBanner({
	title,
	subtitle,
	ctaLabel,
}: {
	title: string;
	subtitle: string;
	ctaLabel: string;
}) {
	return (
		<View className="gap-2 rounded-lg border border-border-critical bg-surface-critical px-3 py-3">
			<View className="flex-row items-center gap-2">
				<Feather name="alert-triangle" size={14} color="var(--color-icon)" />
				<AppText className="font-semibold text-foreground-strong text-sm">
					{title}
				</AppText>
			</View>
			<AppText className="text-foreground-weak text-xs">{subtitle}</AppText>
			<Button size="sm" variant="outline" accessibilityLabel={ctaLabel}>
				{ctaLabel}
			</Button>
		</View>
	);
}

export function EmptyStateCard({
	title,
	subtitle,
	ctaLabel,
	onPress,
}: {
	title: string;
	subtitle: string;
	ctaLabel: string;
	onPress?: () => void;
}) {
	return (
		<View className="gap-2 rounded-lg border border-border bg-surface px-3 py-3">
			<AppText className="font-semibold text-foreground-strong text-sm">
				{title}
			</AppText>
			<AppText className="text-foreground-weak text-xs">{subtitle}</AppText>
			<Button
				size="sm"
				variant="outline"
				onPress={onPress}
				accessibilityLabel={ctaLabel}
			>
				{ctaLabel}
			</Button>
		</View>
	);
}

export function LoadingList({
	count,
	rowHeight,
}: {
	count: number;
	rowHeight: number;
}) {
	const keys = useMemo(
		() =>
			Array.from(
				{ length: count },
				() => `Skeleton-${Math.random().toString(36).slice(2)}`,
			),
		[count],
	);

	return (
		<View className="gap-3 px-3 py-3">
			{keys.map((key) => (
				<View
					key={key}
					className="justify-center rounded-lg border border-border bg-surface px-3"
					style={{ height: rowHeight }}
				>
					<View className="gap-2">
						<View className="h-3 w-2/3 rounded-full bg-surface-weak" />
						<View className="h-3 w-1/3 rounded-full bg-surface-weak" />
					</View>
				</View>
			))}
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
		selectedSessionId,
		setSelectedWorkspaceId,
		setSelectedProjectId,
		setSelectedSessionId,
	} = useWorkspaceNav();

	const [sessions, setSessions] = useState(sessionRows);

	const handleSelectSession = (sessionId: string) => {
		setSelectedSessionId(sessionId);
	};

	const handleCreateSession = () => {
		const nextSession = buildNewSession(sessions);
		setSessions((prev) => [...prev, nextSession]);
		setSelectedSessionId(nextSession.name);
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

	const sidebarWidth = useSharedValue(
		clampWidth(baseSidebarWidth, sidebarMin, effectiveSidebarMax),
	);
	const middleWidth = useSharedValue(
		clampWidth(baseMiddleWidth, middleMin, effectiveMiddleMax),
	);
	const startSidebarWidth = useSharedValue(sidebarWidth.value);
	const startMiddleWidth = useSharedValue(middleWidth.value);

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
						onSelectProject={setSelectedProjectId}
						onSelectWorkspace={setSelectedWorkspaceId}
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
						listState={listState}
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
