import type { Href } from "expo-router";
import { Link } from "expo-router";
import { Pressable, SectionList, View } from "react-native";

import { AppText } from "@/components/app-text";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { workspaceGroups } from "@/components/workspace-mockups/mock-data";
import {
	AppShell,
	LogoEmptyState,
	ROW_HEIGHTS,
} from "@/components/workspace-mockups/shared";
import { WorkspaceItem } from "@/components/workspace-mockups/workspace-item";
import { useWorkspaceLayout } from "@/lib/hooks/use-workspace-layout";
import { breakpoints } from "@/lib/tokens";

const NEXT_ROUTE = "/workspaces/projects" as Href;

export default function WorkspacesScreen() {
	const { width, height } = useWorkspaceLayout();
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
					/>
				</View>
			) : (
				<MobileWorkspaces />
			)}
		</Container>
	);
}

function MobileWorkspaces() {
	const rowHeight = ROW_HEIGHTS.mobile;
	const sections = workspaceGroups.map((group) => ({
		title: group.owner,
		ownerInitials: group.ownerInitials,
		workspaceCount: group.rows.length,
		data: group.rows,
	}));

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
						<Button size="sm" variant="outline">
							New
						</Button>
					</View>
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
