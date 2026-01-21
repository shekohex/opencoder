import { Feather } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { Link, useRouter } from "expo-router";
import { useCallback } from "react";
import { Pressable, View } from "react-native";

import { AppText } from "@/components/app-text";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { ProjectsListContent } from "@/components/projects-list";
import { ROW_HEIGHTS } from "@/components/workspace-list/shared";
import { useOpenCodeProjects } from "@/lib/project-queries";
import { useWorkspaceNav } from "@/lib/workspace-nav";
import { useWorkspaceName } from "@/lib/workspace-queries";
import { buildWorkspacePath } from "@/lib/workspace-query-params";

const BACK_ROUTE = "/workspaces" as Href;

export default function WorkspaceProjectsScreen() {
	const rowHeight = ROW_HEIGHTS.mobile;
	const { selectedWorkspaceId } = useWorkspaceNav();
	const router = useRouter();
	const { projectGroups, isLoading, isError, error } =
		useOpenCodeProjects(selectedWorkspaceId);
	const workspaceName = useWorkspaceName(selectedWorkspaceId);

	const buildNextHref = useCallback(
		(projectId: string, worktree: string) =>
			buildWorkspacePath({
				workspaceId: selectedWorkspaceId,
				projectId,
				worktree,
			}),
		[selectedWorkspaceId],
	);

	const handleOpenSettings = useCallback(() => {
		router.push(`/workspaces/${selectedWorkspaceId}/settings` as Href);
	}, [router, selectedWorkspaceId]);

	return (
		<Container>
			<ProjectsListContent
				projectGroups={projectGroups}
				isLoading={isLoading}
				isError={isError}
				error={error}
				selectedProjectId={null}
				onSelectProject={() => {}}
				variant="page"
				rowHeight={rowHeight}
				buildNextHref={buildNextHref}
				headerComponent={
					<MobileHeader
						title={workspaceName ?? "Projects"}
						backLabel="Workspaces"
						backHref={BACK_ROUTE}
						onSettingsPress={handleOpenSettings}
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
	onSettingsPress,
}: {
	title: string;
	backLabel: string;
	backHref: Href;
	onSettingsPress: () => void;
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
				<View className="flex-row items-center gap-2">
					<Button size="sm" variant="outline" onPress={onSettingsPress}>
						<Feather name="settings" size={14} />
					</Button>
					<Button size="sm" variant="outline">
						New
					</Button>
				</View>
			</View>
		</View>
	);
}
