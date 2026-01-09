import { Feather } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { Link } from "expo-router";
import { Pressable, View } from "react-native";

import { AppText } from "@/components/app-text";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { ProjectsListContent } from "@/components/projects-list";
import { ROW_HEIGHTS } from "@/components/workspace-mockups/shared";
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
				nextHref={NEXT_ROUTE}
				headerComponent={
					<MobileHeader
						title="Projects"
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
