import { Feather } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { Link } from "expo-router";
import { Pressable, SectionList, View } from "react-native";

import { AppText } from "@/components/app-text";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { buildStatus } from "@/components/workspace-mockups/mock-data";
import {
	AppShell,
	LogoEmptyState,
	ROW_HEIGHTS,
	useWorkspacePolling,
} from "@/components/workspace-mockups/shared";
import { WorkspaceItem } from "@/components/workspace-mockups/workspace-item";
import { useWorkspaceLayout } from "@/lib/hooks/use-workspace-layout";
import { breakpoints } from "@/lib/tokens";
import { useCoderBrowser } from "@/lib/use-coder-browser";

const NEXT_ROUTE = "/workspaces/projects" as Href;

export default function WorkspacesScreen() {
	const { width, height } = useWorkspaceLayout();
	const { openTemplates } = useCoderBrowser();
	const { workspaceGroups, hasActiveBuilds } = useWorkspacePolling();
	const frameHeight = Math.max(640, height);
	const availableWidth = width;

	const isDesktop = width >= breakpoints.lg;
	const isTablet = width >= breakpoints.md && width < breakpoints.lg;
	const showRightPanel = width >= breakpoints.xl;

	return (
		<Container>
			{isDesktop || isTablet ? (
				<View className="flex-1 bg-background">
					<AppShell
						breakpoint={isDesktop ? "desktop" : "tablet"}
						showRightPanel={showRightPanel}
						availableWidth={availableWidth}
						height={frameHeight}
						isFramed={false}
						workspaceGroups={workspaceGroups}
						onCreateWorkspace={openTemplates}
					/>
				</View>
			) : (
				<MobileWorkspaces
					workspaceGroups={workspaceGroups}
					hasActiveBuilds={hasActiveBuilds}
				/>
			)}
		</Container>
	);
}

const COMPACT_WIDTH_THRESHOLD = 360;

function MobileWorkspaces({
	workspaceGroups,
	hasActiveBuilds,
}: {
	workspaceGroups: typeof import("@/components/workspace-mockups/mock-data").workspaceGroups;
	hasActiveBuilds: boolean;
}) {
	const { width } = useWorkspaceLayout();
	const { openTemplates, openBuildPage } = useCoderBrowser();
	const rowHeight = ROW_HEIGHTS.mobile;
	const isCompact = width < COMPACT_WIDTH_THRESHOLD;
	const sections = workspaceGroups.map((group) => ({
		title: group.owner,
		ownerInitials: group.ownerInitials,
		workspaceCount: group.rows.length,
		data: group.rows,
	}));

	const handleOpenBuildPage = () => {
		openBuildPage("me", "my-workspace", 1);
	};

	return (
		<SectionList
			sections={sections}
			keyExtractor={(item, index) => `${item.name}-${index}`}
			className="flex-1 bg-background"
			contentContainerStyle={{ padding: 16 }}
			ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
			renderItem={({ item, section }) => (
				<Link key={item.name} href={NEXT_ROUTE} asChild>
					<Pressable>
						<WorkspaceItem
							row={item}
							ownerInitials={section.ownerInitials}
							rowHeight={rowHeight}
						/>
					</Pressable>
				</Link>
			)}
			renderSectionHeader={({ section }) => (
				<View className="gap-2 pt-4">
					<View className="flex-row items-center justify-between">
						<AppText className="text-foreground-weak text-xs uppercase">
							{section.title}
						</AppText>
						<AppText className="text-foreground-weaker text-xs">
							{section.workspaceCount} workspaces
						</AppText>
					</View>
				</View>
			)}
			ListHeaderComponent={
				<View className="gap-4">
					<View className="flex-row items-center justify-between">
						<AppText className="font-semibold text-foreground-strong text-lg">
							Workspaces
						</AppText>
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
					{hasActiveBuilds && <BuildBanner onPress={handleOpenBuildPage} />}
				</View>
			}
			ListFooterComponent={
				<View className="mt-4">
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
			className="gap-1 rounded-lg border border-border-info bg-surface-info px-3 py-2"
			accessibilityRole="button"
			accessibilityLabel="View build progress"
		>
			<View className="flex-row items-center justify-between">
				<View className="flex-row items-center gap-2">
					<View className="h-2 w-2 rounded-full bg-icon-info" />
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
		</Pressable>
	);
}
