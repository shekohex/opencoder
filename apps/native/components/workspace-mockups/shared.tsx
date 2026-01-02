import { Feather } from "@expo/vector-icons";
import { Logo } from "@opencoder/branding";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo } from "react";
import { Pressable, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated";
import { Accordion } from "@/components/accordion";
import { useAccordionItemContext } from "@/components/accordion.shared";
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
	workspaceGroups,
} from "./mock-data";

export type BreakpointName = "desktop" | "tablet";

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

export function WorkspaceThreePane({
	breakpoint,
	showRightPanel = true,
	height,
	availableWidth,
	isFramed = true,
	selectedWorkspaceId,
	selectedProjectId,
	onSelectProject,
	selectedSessionId,
}: {
	breakpoint: BreakpointName;
	showRightPanel?: boolean;
	height?: number;
	availableWidth?: number;
	isFramed?: boolean;
	selectedWorkspaceId?: string | null;
	selectedProjectId?: string | null;
	onSelectProject?: (id: string) => void;
	selectedSessionId?: string | null;
}) {
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
					/>
				</Animated.View>
				<ResizeHandle gesture={leftHandle} />
				<Animated.View
					className="border-border border-r bg-background"
					style={middleStyle}
				>
					<SessionSidebarContent
						rowHeight={rowHeight}
						selectedSessionId={selectedSessionId ?? null}
					/>
				</Animated.View>
				<ResizeHandle gesture={middleHandle} />
				<ChatPanel />
				{showRightPanel && <InfoSidebar width={RIGHT_PANEL_WIDTH} />}
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

function WorkspaceSidebarContent({
	rowHeight,
	selectedWorkspaceId,
	selectedProjectId,
	onSelectProject,
}: {
	rowHeight: number;
	selectedWorkspaceId: string | null;
	selectedProjectId: string | null;
	onSelectProject: (id: string) => void;
}) {
	const { setSelectedWorkspaceId } = useWorkspaceNav();

	const handleWorkspacePress = useCallback(
		(workspaceName: string) => {
			setSelectedWorkspaceId(workspaceName);
		},
		[setSelectedWorkspaceId],
	);

	return (
		<View>
			<ListHeader title="Workspaces" actionLabel="New" />
			<Accordion type="single" collapsible>
				{workspaceGroups.map((group) =>
					group.rows.map((row) => {
						const isSelected = row.name === selectedWorkspaceId;
						const workspaceValue = `workspace-${row.name}`;

						return (
							<Accordion.Item key={workspaceValue} value={workspaceValue}>
								<WorkspaceAccordionTrigger
									row={row}
									ownerInitials={group.ownerInitials}
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
					}),
				)}
			</Accordion>
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
	row: (typeof workspaceGroups)[number]["rows"][number];
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
				className="ml-2 h-8 w-8 items-center justify-center"
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
	selectedSessionId,
}: {
	rowHeight: number;
	selectedSessionId: string | null;
}) {
	return (
		<View>
			<ListHeader title="Sessions" actionLabel="New" />
			<View className="gap-3 px-3 pb-3">
				{sessionRows.map((session) => (
					<SessionRow
						key={session.name}
						title={session.name}
						status={session.status}
						lastUsed={session.lastUsed}
						height={rowHeight}
						isActive={session.name === selectedSessionId}
					/>
				))}
				<ErrorCard
					title="Server offline"
					subtitle="Open Code server is unreachable."
					ctaLabel="Retry"
				/>
			</View>
		</View>
	);
}

function ChatPanel() {
	return (
		<View className="flex-1 bg-background">
			<View className="border-border border-b bg-surface px-4 py-3">
				<AppText className="font-semibold text-base text-foreground-strong">
					opencode / Workspace nav
				</AppText>
				<AppText className="text-foreground-weak text-xs">
					Design system audit · Session 12
				</AppText>
			</View>
			<View className="flex-1 gap-3 p-4">
				<BuildBanner />
				{messageRows.map((message, index) => (
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

function InfoSidebar({ width }: { width: number }) {
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
						{sessionRows.slice(0, 2).map((session) => (
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
}: {
	title: string;
	actionLabel: string;
}) {
	return (
		<View className="flex-row items-center justify-between border-border border-b px-3 py-3">
			<AppText className="font-semibold text-foreground-strong text-sm">
				{title}
			</AppText>
			<Button size="sm" variant="outline">
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
			className={`justify-center rounded-lg px-3 ${
				isSelected ? "bg-surface" : "bg-transparent"
			}`}
			style={{ height }}
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
}: {
	title: string;
	status: string;
	lastUsed: string;
	height: number;
	isActive?: boolean;
}) {
	return (
		<View
			className={`justify-center rounded-lg px-3 ${
				isActive ? "bg-surface" : "bg-transparent"
			}`}
			style={{ height }}
		>
			<View className="flex-row items-center justify-between">
				<AppText className="text-foreground-strong text-sm">{title}</AppText>
				<AppText className="text-foreground-weak text-xs">{status}</AppText>
			</View>
			<AppText className="text-foreground-weak text-xs">
				Updated {lastUsed}
			</AppText>
		</View>
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
			<Button size="sm" variant="outline">
				{ctaLabel}
			</Button>
		</View>
	);
}

export function AppShell({
	breakpoint,
	showRightPanel = true,
	height,
	availableWidth,
	isFramed = true,
}: {
	breakpoint: BreakpointName;
	showRightPanel?: boolean;
	height?: number;
	availableWidth?: number;
	isFramed?: boolean;
}) {
	const {
		selectedWorkspaceId,
		selectedProjectId,
		selectedSessionId,
		setSelectedProjectId,
	} = useWorkspaceNav();

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
						selectedWorkspaceId={selectedWorkspaceId}
						selectedProjectId={selectedProjectId}
						onSelectProject={setSelectedProjectId}
					/>
				</Animated.View>
				<ResizeHandle gesture={leftHandle} />
				<Animated.View
					className="border-border border-r bg-background"
					style={middleStyle}
				>
					<SessionSidebarContent
						rowHeight={rowHeight}
						selectedSessionId={selectedSessionId}
					/>
				</Animated.View>
				<ResizeHandle gesture={middleHandle} />
				<ChatPanel />
				{showRightPanel && <InfoSidebar width={RIGHT_PANEL_WIDTH} />}
			</View>
		</View>
	);
}
