import { Feather } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { Link } from "expo-router";
import { useCallback } from "react";
import { Pressable, View } from "react-native";

import { AppText } from "@/components/app-text";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { ProjectsListContent } from "@/components/projects-list";
import { ROW_HEIGHTS } from "@/components/workspace-mockups/shared";
import { useOpenCodeProjects } from "@/lib/project-queries";
import { useWorkspaceNav } from "@/lib/workspace-nav";
import { useWorkspaceName } from "@/lib/workspace-queries";
import { buildWorkspaceHref } from "@/lib/workspace-query-params";

const BACK_ROUTE = "/workspaces" as Href;

export default function WorkspacesProjectsScreen() {
	const rowHeight = ROW_HEIGHTS.mobile;
	const { selectedWorkspaceId, selectedProjectId, setSelectedProjectId } =
		useWorkspaceNav();
	const { projectGroups, isLoading, isError, error } =
		useOpenCodeProjects(selectedWorkspaceId);
	const workspaceName = useWorkspaceName(selectedWorkspaceId);

	const buildNextHref = useCallback(
		(projectId: string, worktree: string) =>
			buildWorkspaceHref("/workspaces/sessions", {
				workspaceId: selectedWorkspaceId,
				projectId,
				worktree,
			}),
		[selectedWorkspaceId],
	);

	return (
		<Container>
			<ProjectsListContent
				projectGroups={projectGroups}
				isLoading={isLoading}
				isError={isError}
				error={error}
				selectedProjectId={selectedProjectId}
				onSelectProject={setSelectedProjectId}
				variant="page"
				rowHeight={rowHeight}
				buildNextHref={buildNextHref}
				headerComponent={
					<MobileHeader
						title={workspaceName ?? "Projects"}
						backLabel="Workspaces"
						backHref={BACK_ROUTE}
					/>
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
		<View className="gap-3">
			<Link href={backHref} asChild>
				<Pressable
					className="focus-ring -ml-2 flex-row items-center gap-1 rounded-full px-2 py-2"
					style={{ minWidth: 44, minHeight: 44 }}
				>
					<Feather name="chevron-left" size={18} color="var(--color-icon)" />
					<AppText className="text-foreground-weak text-sm">
						{backLabel}
					</AppText>
				</Pressable>
			</Link>
			<View className="flex-row items-center justify-between">
				<AppText className="font-semibold text-foreground-strong text-xl">
					{title}
				</AppText>
				<Button size="sm" variant="outline">
					New
				</Button>
			</View>
		</View>
	);
}
