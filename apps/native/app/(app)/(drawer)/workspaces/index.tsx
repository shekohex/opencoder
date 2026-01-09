import { Feather } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import { useMemo } from "react";
import { Pressable, SectionList, View } from "react-native";

import { AppText } from "@/components/app-text";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { buildStatus } from "@/components/workspace-mockups/mock-data";
import {
	ChatPanel,
	EmptyStateCard,
	ErrorBanner,
	InfoSidebar,
	type ListState,
	LoadingList,
	LogoEmptyState,
	RIGHT_PANEL_WIDTH,
	ROW_HEIGHTS,
	useWorkspacePolling,
	type WorkspaceGroup,
} from "@/components/workspace-mockups/shared";
import { WorkspaceItem } from "@/components/workspace-mockups/workspace-item";
import { useWorkspaceLayout } from "@/lib/hooks/use-workspace-layout";
import { useOpenCodeSessions } from "@/lib/session-queries";
import { breakpoints } from "@/lib/tokens";
import { useCoderBrowser } from "@/lib/use-coder-browser";
import { useDocumentTitle } from "@/lib/use-document-title";
import { useWorkspaceNav } from "@/lib/workspace-nav";
import { useWorkspaces } from "@/lib/workspace-queries";
import { buildWorkspaceHref } from "@/lib/workspace-query-params";

export default function WorkspacesScreen() {
	const { width, height } = useWorkspaceLayout();
	const { openTemplates } = useCoderBrowser();
	const { workspaceGroups, hasActiveBuilds, isLoading, isError } =
		useWorkspacePolling();
	const { state } = useLocalSearchParams<{ state?: string }>();

	const getListState = (): ListState => {
		if (state === "loading" || state === "error" || state === "empty") {
			return state;
		}
		if (isLoading) return "loading";
		if (isError) return "error";
		if (workspaceGroups.length === 0) return "empty";
		return "ready";
	};

	const resolvedListState = getListState();
	const _frameHeight = Math.max(640, height);
	const _availableWidth = width;

	const isDesktop = width >= breakpoints.lg;
	const isTablet = width >= breakpoints.md && width < breakpoints.lg;
	const showRightPanel = width >= breakpoints.xl;

	return (
		<Container>
			{isDesktop || isTablet ? (
				<DesktopContent
					showRightPanel={showRightPanel}
					listState={resolvedListState}
				/>
			) : (
				<MobileWorkspaces
					workspaceGroups={workspaceGroups}
					hasActiveBuilds={hasActiveBuilds}
					listState={resolvedListState}
				/>
			)}
		</Container>
	);
}

function DesktopContent({
	showRightPanel,
	listState,
}: {
	showRightPanel: boolean;
	listState: ListState;
}) {
	const { selectedWorkspaceId, selectedProjectWorktree, selectedSessionId } =
		useWorkspaceNav();
	const { sessions } = useOpenCodeSessions(
		selectedWorkspaceId,
		selectedProjectWorktree ?? undefined,
	);
	const { data: workspaces } = useWorkspaces();

	const workspaceName = useMemo(() => {
		if (!workspaces || !selectedWorkspaceId) return null;
		return workspaces.find((w) => w.id === selectedWorkspaceId)?.name ?? null;
	}, [workspaces, selectedWorkspaceId]);

	const projectName = useMemo(() => {
		if (!selectedProjectWorktree) return null;
		return selectedProjectWorktree.split("/").pop() ?? null;
	}, [selectedProjectWorktree]);

	const sessionName = useMemo(() => {
		if (!sessions || !selectedSessionId) return null;
		return sessions.find((s) => s.id === selectedSessionId)?.name ?? null;
	}, [sessions, selectedSessionId]);

	useDocumentTitle({
		session: sessionName,
		project: projectName,
		workspace: workspaceName,
	});

	return (
		<View className="flex-1 flex-row bg-background">
			<ChatPanel
				sessionTitle={sessionName ?? undefined}
				messageState={listState}
			/>
			{showRightPanel && (
				<InfoSidebar width={RIGHT_PANEL_WIDTH} sessions={sessions} />
			)}
		</View>
	);
}

const COMPACT_WIDTH_THRESHOLD = 360;

function MobileWorkspaces({
	workspaceGroups,
	hasActiveBuilds,
	listState,
}: {
	workspaceGroups: WorkspaceGroup[];
	hasActiveBuilds: boolean;
	listState: ListState;
}) {
	const { width } = useWorkspaceLayout();
	const { setSelectedWorkspaceId } = useWorkspaceNav();
	const { openTemplates, openBuildPage } = useCoderBrowser();
	const navigation = useNavigation();
	const rowHeight = ROW_HEIGHTS.mobile;
	const isCompact = width < COMPACT_WIDTH_THRESHOLD;
	const sections = workspaceGroups.map((group) => ({
		title: group.owner,
		ownerInitials: group.ownerInitials,
		workspaceCount: group.rows.length,
		data: group.rows,
	}));
	const listSections = listState === "ready" ? sections : [];

	const handleOpenBuildPage = () => {
		openBuildPage("me", "my-workspace", 1);
	};

	return (
		<SectionList
			sections={listSections}
			keyExtractor={(item, index) => `${item.name}-${index}`}
			className="flex-1 bg-background"
			contentContainerStyle={{ padding: 20 }}
			ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
			renderItem={({ item, section }) => (
				<Link
					key={item.name}
					href={buildWorkspaceHref("/workspaces/projects", {
						workspaceId: item.id ?? item.name,
					})}
					asChild
				>
					<Pressable
						onPress={() => setSelectedWorkspaceId(item.id ?? item.name)}
						className="focus-ring rounded-2xl"
						accessibilityRole="button"
						accessibilityLabel={`Open workspace ${item.name}`}
					>
						<WorkspaceItem
							row={item}
							ownerInitials={section.ownerInitials}
							rowHeight={rowHeight}
						/>
					</Pressable>
				</Link>
			)}
			renderSectionHeader={({ section }) => (
				<View className="pt-6 pb-3">
					<View className="flex-row items-center justify-between">
						<AppText className="font-medium text-foreground-weak text-sm uppercase tracking-wide">
							{section.title}
						</AppText>
						<AppText className="text-foreground-weaker text-xs">
							{section.workspaceCount} workspaces
						</AppText>
					</View>
				</View>
			)}
			ListHeaderComponent={
				<View className="gap-5">
					<View className="flex-row items-center justify-between">
						<View className="flex-row items-center gap-3">
							<Pressable
								onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
								className="focus-ring -ml-2 items-center justify-center rounded-full"
								style={{ width: 44, height: 44 }}
								accessibilityRole="button"
								accessibilityLabel="Open menu"
							>
								<Feather name="menu" size={20} color="var(--color-icon)" />
							</Pressable>
							<AppText className="font-semibold text-foreground-strong text-xl">
								Workspaces
							</AppText>
						</View>
						<Button
							size="sm"
							variant="outline"
							onPress={openTemplates}
							leftIcon={
								<Feather name="plus" size={14} color="var(--color-icon)" />
							}
							accessibilityLabel="Create workspace"
						>
							{isCompact ? null : "New"}
						</Button>
					</View>
					{listState === "error" && (
						<ErrorBanner
							title="Sync issue"
							subtitle="Unable to load workspaces."
							ctaLabel="Retry"
						/>
					)}
					{hasActiveBuilds && <BuildBanner onPress={handleOpenBuildPage} />}
				</View>
			}
			ListEmptyComponent={
				listState === "loading" ? (
					<LoadingList count={5} rowHeight={rowHeight} />
				) : listState === "empty" ? (
					<EmptyStateCard
						title="No workspaces yet"
						subtitle="Create your first workspace to get started."
						ctaLabel="Create workspace"
						onPress={openTemplates}
					/>
				) : null
			}
			ListFooterComponent={
				<View className="mt-6">
					<LogoEmptyState
						title="Invite your team"
						subtitle="Share workspaces and keep sessions in sync across projects."
					/>
				</View>
			}
		/>
	);
}

function BuildBanner({ onPress }: { onPress: () => void }) {
	return (
		<Pressable
			onPress={onPress}
			className="focus-ring gap-2 rounded-2xl border border-border-info bg-surface-info px-4 py-3"
			accessibilityRole="button"
			accessibilityLabel="View build progress"
		>
			<View className="flex-row items-center justify-between">
				<View className="flex-row items-center gap-2">
					<View className="h-2 w-2 rounded-full bg-icon-info" />
					<AppText className="font-semibold text-foreground-strong text-sm">
						{buildStatus.title}
					</AppText>
				</View>
				<AppText className="text-foreground-weak text-xs">
					{buildStatus.detail}
				</AppText>
			</View>
			<AppText className="text-foreground-weak text-sm">
				{buildStatus.stage}
			</AppText>
		</Pressable>
	);
}
