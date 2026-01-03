import { Feather } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { Link } from "expo-router";
import { Pressable, SectionList, View } from "react-native";

import { AppText } from "@/components/app-text";
import { Button } from "@/components/button";
import { Container } from "@/components/container";

import { projectGroups } from "@/components/workspace-mockups/mock-data";
import { ROW_HEIGHTS } from "@/components/workspace-mockups/shared";

const BACK_ROUTE = "/workspace-mockups/mobile" as Href;
const NEXT_ROUTE = "/workspace-mockups/mobile/sessions" as Href;

export default function WorkspaceMockupsMobileProjects() {
	const rowHeight = ROW_HEIGHTS.mobile;

	const sections = projectGroups.map((group) => ({
		title: group.title,
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
				renderItem={({ item: project }) => (
					<Link key={project.name} href={NEXT_ROUTE} asChild>
						<Pressable
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
				)}
				renderSectionHeader={({ section }) => (
					<View className="gap-2 pt-4">
						<AppText className="text-foreground-weak text-xs uppercase">
							{section.title}
						</AppText>
					</View>
				)}
				ListHeaderComponent={
					<View className="mb-4">
						<MobileHeader
							title="Projects"
							backLabel="Workspaces"
							backHref={BACK_ROUTE}
						/>
					</View>
				}
				ListFooterComponent={
					<View className="mt-4">
						<ErrorCard />
					</View>
				}
			/>
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
