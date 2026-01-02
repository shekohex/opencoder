import { Feather } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { Link } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";

import { AppText } from "@/components/app-text";
import { Button } from "@/components/button";
import { Container } from "@/components/container";

import { projectGroups } from "@/components/workspace-mockups/mock-data";
import { ROW_HEIGHTS } from "@/components/workspace-mockups/shared";
import { useWorkspaceNav } from "@/lib/workspace-nav";

const BACK_ROUTE = "/workspaces" as Href;
const NEXT_ROUTE = "/workspaces/sessions" as Href;

export default function WorkspacesProjectsScreen() {
	const rowHeight = ROW_HEIGHTS.mobile;
	const { setSelectedWorkspaceId } = useWorkspaceNav();

	return (
		<Container>
			<ScrollView
				className="flex-1 bg-background"
				contentContainerClassName="p-4"
			>
				<View className="gap-4">
					<MobileHeader
						title="Projects"
						backLabel="Workspaces"
						backHref={BACK_ROUTE}
					/>
					{projectGroups.map((group) => (
						<View key={group.title} className="gap-2">
							<AppText className="text-foreground-weak text-xs uppercase">
								{group.title}
							</AppText>
							{group.rows.map((project) => (
								<Link key={project.name} href={NEXT_ROUTE} asChild>
									<Pressable
										onPress={() => setSelectedWorkspaceId("core-platform")}
										className="rounded-lg border border-border bg-surface px-3"
										style={{ height: rowHeight }}
									>
										<View className="flex-row items-center justify-between">
											<AppText className="font-medium text-foreground-strong text-sm">
												{project.name}
											</AppText>
											<AppText className="text-foreground-weak text-xs">
												{project.status}
											</AppText>
										</View>
										<AppText className="text-foreground-weak text-xs">
											Updated {project.lastUsed}
										</AppText>
									</Pressable>
								</Link>
							))}
						</View>
					))}
					<ErrorCard />
				</View>
			</ScrollView>
		</Container>
	);
}

function MobileHeader({
	title,
	backLabel,
	backHref,
}: {
	title: string;
	backLabel: string;
	backHref: Href;
}) {
	return (
		<View className="gap-2">
			<Link href={backHref} asChild>
				<Pressable className="flex-row items-center gap-2">
					<Feather name="chevron-left" size={14} color="var(--color-icon)" />
					<AppText className="text-foreground-weak text-xs">
						{backLabel}
					</AppText>
				</Pressable>
			</Link>
			<View className="flex-row items-center justify-between">
				<AppText className="font-semibold text-foreground-strong text-lg">
					{title}
				</AppText>
				<Button size="sm" variant="outline">
					New
				</Button>
			</View>
		</View>
	);
}

function ErrorCard() {
	return (
		<View className="gap-2 rounded-lg border border-border-critical bg-surface-critical px-3 py-3">
			<AppText className="font-semibold text-foreground-strong text-sm">
				Sync issue
			</AppText>
			<AppText className="text-foreground-weak text-xs">
				Unable to load the latest project status.
			</AppText>
			<Button size="sm" variant="outline">
				Retry
			</Button>
		</View>
	);
}
