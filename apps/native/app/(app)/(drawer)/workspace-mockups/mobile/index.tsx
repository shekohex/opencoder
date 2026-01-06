import type { Href } from "expo-router";
import { Link } from "expo-router";
import { Pressable, SectionList, View } from "react-native";

import { AppText } from "@/components/app-text";
import { Button } from "@/components/button";
import { Container } from "@/components/container";

import { workspaceGroups } from "@/components/workspace-mockups/mock-data";
import {
	LogoEmptyState,
	ROW_HEIGHTS,
} from "@/components/workspace-mockups/shared";

const NEXT_ROUTE = "/workspace-mockups/mobile/projects" as Href;

export default function WorkspaceMockupsMobileWorkspaces() {
	const rowHeight = ROW_HEIGHTS.mobile;

	const sections = workspaceGroups.map((group) => ({
		title: group.owner,
		ownerInitials: group.ownerInitials,
		workspaceCount: group.rows.length,
		data: group.rows,
	}));

	return (
		<Container>
			<SectionList
				sections={sections}
				keyExtractor={(item, index) => `${item.name}-${index}`}
				className="flex-1 bg-background"
				contentContainerStyle={{ padding: 16 }}
				ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
				renderItem={({ item: row, section }) => (
					<Link key={row.name} href={NEXT_ROUTE} asChild>
						<Pressable
							className="flex-row items-center gap-3 rounded-xl border border-border bg-surface px-3"
							style={{ height: rowHeight }}
						>
							<View className="h-8 w-8 items-center justify-center rounded-full bg-surface-weak">
								<AppText className="font-semibold text-foreground-strong text-xs">
									{section.ownerInitials}
								</AppText>
							</View>
							<View className="flex-1 gap-1">
								<View className="flex-row items-center gap-2">
									<AppText className="font-medium text-foreground-strong text-sm">
										{row.name}
									</AppText>
									{row.badges.map((badge) => (
										<View
											key={`${row.name}-${badge}`}
											className="rounded-full bg-surface-weak px-2 py-0.5"
										>
											<AppText className="text-foreground-weak text-xs uppercase">
												{badge}
											</AppText>
										</View>
									))}
								</View>
								<AppText className="text-foreground-weak text-xs">
									Last used {row.lastUsed}
								</AppText>
							</View>
							<View className="flex-row items-center gap-1">
								<View
									className={`h-2 w-2 rounded-full ${
										row.statusTone === "success"
											? "bg-surface-success"
											: row.statusTone === "warning"
												? "bg-surface-warning"
												: "bg-surface-weak"
									}`}
								/>
								<AppText className="text-foreground-weak text-xs">
									{row.status}
								</AppText>
							</View>
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
						<MobileHeader title="Workspaces" actionLabel="New" />
					</View>
				}
				ListFooterComponent={
					<View className="mt-4">
						<LogoEmptyState
							title="Start your first workspace"
							subtitle="Create a workspace, import a repo, or invite teammates."
						/>
					</View>
				}
			/>
		</Container>
	);
}

function MobileHeader({
	title,
	actionLabel,
}: {
	title: string;
	actionLabel: string;
}) {
	return (
		<View className="flex-row items-center justify-between">
			<AppText className="font-semibold text-foreground-strong text-lg">
				{title}
			</AppText>
			<Button size="sm" variant="outline">
				{actionLabel}
			</Button>
		</View>
	);
}
