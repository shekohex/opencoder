import { Feather } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Link } from "expo-router";
import { Pressable, SectionList, View } from "react-native";

import { AppText } from "@/components/app-text";
import { Button } from "@/components/button";
import {
	buildStatus,
	EmptyStateCard,
	ErrorBanner,
	type ListState,
	LoadingList,
	LogoEmptyState,
	ROW_HEIGHTS,
	type WorkspaceGroup,
} from "@/components/workspace-list/shared";
import { WorkspaceItem } from "@/components/workspace-list/workspace-item";
import { useWorkspaceLayout } from "@/lib/hooks/use-workspace-layout";
import { useCoderBrowser } from "@/lib/use-coder-browser";
import { buildWorkspacePath } from "@/lib/workspace-query-params";

const COMPACT_WIDTH_THRESHOLD = 360;

export type MobileWorkspacesProps = {
	workspaceGroups: WorkspaceGroup[];
	hasActiveBuilds: boolean;
	listState: ListState;
};

export function MobileWorkspaces({
	workspaceGroups,
	hasActiveBuilds,
	listState,
}: MobileWorkspacesProps) {
	const { width } = useWorkspaceLayout();
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
					href={buildWorkspacePath({
						workspaceId: item.id ?? item.name,
					})}
					asChild
				>
					<Pressable
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
