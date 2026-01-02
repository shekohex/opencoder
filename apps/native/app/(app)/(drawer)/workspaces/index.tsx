import type { Href } from "expo-router";
import { Link } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";

import { AppText } from "@/components/app-text";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { workspaceGroups } from "@/components/workspace-mockups/mock-data";
import {
	AppShell,
	LogoEmptyState,
	ROW_HEIGHTS,
} from "@/components/workspace-mockups/shared";
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
				<ScrollView
					className="flex-1 bg-background"
					contentContainerClassName="p-4"
				>
					<MobileWorkspaces />
				</ScrollView>
			)}
		</Container>
	);
}

function MobileWorkspaces() {
	const rowHeight = ROW_HEIGHTS.mobile;

	return (
		<View className="gap-4">
			<View className="flex-row items-center justify-between">
				<AppText className="font-semibold text-foreground-strong text-lg">
					Workspaces
				</AppText>
				<Button size="sm" variant="outline">
					New
				</Button>
			</View>
			<View className="gap-3">
				{workspaceGroups.map((group) => (
					<View key={group.owner} className="gap-2">
						<View className="flex-row items-center justify-between">
							<AppText className="text-foreground-weak text-xs uppercase">
								{group.owner}
							</AppText>
							<AppText className="text-foreground-weaker text-xs">
								{group.rows.length} workspaces
							</AppText>
						</View>
						{group.rows.map((row) => (
							<Link key={row.name} href={NEXT_ROUTE} asChild>
								<Pressable
									className="flex-row items-center gap-3 rounded-lg border border-border bg-surface px-3"
									style={{ height: rowHeight }}
								>
									<View className="h-8 w-8 items-center justify-center rounded-full bg-surface-weak">
										<AppText className="font-semibold text-foreground-strong text-xs">
											{group.ownerInitials}
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
						))}
					</View>
				))}
			</View>
			<LogoEmptyState
				title="Invite your team"
				subtitle="Share workspaces and keep sessions in sync across projects."
			/>
		</View>
	);
}
