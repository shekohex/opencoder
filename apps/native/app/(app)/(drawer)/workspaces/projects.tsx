import { Feather } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { Link } from "expo-router";
import { Pressable, SectionList, View } from "react-native";

import { AppText } from "@/components/app-text";
import { Button } from "@/components/button";
import { Container } from "@/components/container";

import {
	EmptyStateCard,
	ErrorBanner,
	type ListState,
	LoadingList,
	ROW_HEIGHTS,
} from "@/components/workspace-mockups/shared";
import { useOpenCodeProjects } from "@/lib/project-queries";
import { useWorkspaceNav } from "@/lib/workspace-nav";

const BACK_ROUTE = "/workspaces" as Href;
const NEXT_ROUTE = "/workspaces/sessions" as Href;

export default function WorkspacesProjectsScreen() {
	const rowHeight = ROW_HEIGHTS.mobile;
	const { selectedWorkspaceId, selectedProjectId, setSelectedProjectId } =
		useWorkspaceNav();
	const { projectGroups, isLoading, isError, error } =
		useOpenCodeProjects(selectedWorkspaceId);

	const isAgentUnhealthy =
		isError && error && String(error).toLowerCase().includes("agent");

	const getListState = (): ListState => {
		if (isLoading) return "loading";
		if (isError) return "error";
		const hasProjects = projectGroups.some((group) => group.rows.length > 0);
		if (!hasProjects) return "empty";
		return "ready";
	};

	const resolvedListState = getListState();

	const sections = projectGroups.map((group) => ({
		title: group.title,
		data: group.rows,
	}));
	const listSections = resolvedListState === "ready" ? sections : [];

	return (
		<Container>
			<SectionList
				testID="projects-list"
				sections={listSections}
				keyExtractor={(item) => item.id}
				className="flex-1 bg-background"
				contentContainerStyle={{ padding: 16 }}
				ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
				renderItem={({ item: project }) => (
					<Link key={project.id} href={NEXT_ROUTE} asChild>
						<Pressable
							onPress={() => setSelectedProjectId(project.id, project.worktree)}
							className={`focus-ring rounded-xl border px-3 ${
								selectedProjectId === project.id
									? "border-border-info bg-surface-info"
									: "border-border bg-surface"
							}`}
							style={{ height: rowHeight }}
							accessibilityRole="button"
							accessibilityLabel={`Open project ${project.name}`}
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
						{resolvedListState === "error" && (
							<View className="mt-3">
								<ErrorBanner
									title={
										isAgentUnhealthy ? "Agent unavailable" : "Server offline"
									}
									subtitle={
										isAgentUnhealthy
											? "Workspace agent is disconnected. Try restarting the workspace."
											: "OpenCode server is unreachable."
									}
									ctaLabel={isAgentUnhealthy ? "Go back" : "Retry"}
								/>
							</View>
						)}
					</View>
				}
				ListEmptyComponent={
					resolvedListState === "loading" ? (
						<LoadingList count={5} rowHeight={rowHeight} />
					) : resolvedListState === "empty" ? (
						<EmptyStateCard
							title="No projects yet"
							subtitle="Open Coder or check the server connection."
							ctaLabel="Open Coder"
						/>
					) : null
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
				<Pressable className="focus-ring flex-row items-center gap-2 rounded-full">
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
