import type { Href } from "expo-router";
import { SectionList, View } from "react-native";

import {
	EmptyStateCard,
	ErrorBanner,
	type ListState,
	LoadingList,
} from "@/components/workspace-mockups/shared";
import type { ProjectGroup } from "@/lib/project-queries";

import { AgentUnavailableBanner, AgentUnavailableInline } from "./agent-status";
import { ProjectRow } from "./project-row";
import { ProjectSectionHeader } from "./project-section-header";
import { getProjectListState, isAgentUnhealthyError } from "./utils";

export interface ProjectsListContentProps {
	projectGroups: ProjectGroup[];
	isLoading: boolean;
	isError: boolean;
	error: unknown;
	selectedProjectId: string | null;
	onSelectProject: (id: string, worktree?: string) => void;
	variant: "sidebar" | "page";
	rowHeight: number;
	nextHref?: Href;
	headerComponent?: React.ReactNode;
}

export function ProjectsListContent({
	projectGroups,
	isLoading,
	isError,
	error,
	selectedProjectId,
	onSelectProject,
	variant,
	rowHeight,
	nextHref,
	headerComponent,
}: ProjectsListContentProps) {
	const isAgentUnhealthy = isError && isAgentUnhealthyError(error);
	const hasProjects = projectGroups.some((group) => group.rows.length > 0);
	const listState = getProjectListState(isLoading, isError, hasProjects);

	if (variant === "sidebar") {
		return (
			<SidebarProjectsList
				projectGroups={projectGroups}
				listState={listState}
				isAgentUnhealthy={isAgentUnhealthy}
				selectedProjectId={selectedProjectId}
				onSelectProject={onSelectProject}
				rowHeight={rowHeight}
			/>
		);
	}

	return (
		<PageProjectsList
			projectGroups={projectGroups}
			listState={listState}
			isAgentUnhealthy={isAgentUnhealthy}
			selectedProjectId={selectedProjectId}
			onSelectProject={onSelectProject}
			rowHeight={rowHeight}
			nextHref={nextHref}
			headerComponent={headerComponent}
		/>
	);
}

interface SidebarProjectsListProps {
	projectGroups: ProjectGroup[];
	listState: ListState;
	isAgentUnhealthy: boolean;
	selectedProjectId: string | null;
	onSelectProject: (id: string, worktree?: string) => void;
	rowHeight: number;
}

function SidebarProjectsList({
	projectGroups,
	listState,
	isAgentUnhealthy,
	selectedProjectId,
	onSelectProject,
	rowHeight,
}: SidebarProjectsListProps) {
	if (listState === "loading") {
		return (
			<View className="ml-4 gap-3 border-border border-l pb-2 pl-4">
				<View className="gap-1">
					<View className="h-3 w-16 rounded bg-surface-secondary" />
					<View
						className="rounded-lg bg-surface-secondary"
						style={{ height: Math.max(rowHeight - 8, 40) }}
					/>
					<View
						className="rounded-lg bg-surface-secondary"
						style={{ height: Math.max(rowHeight - 8, 40) }}
					/>
				</View>
			</View>
		);
	}

	if (isAgentUnhealthy) {
		return <AgentUnavailableInline />;
	}

	if (listState === "error" || listState === "empty") {
		return (
			<View className="ml-4 gap-1 border-border border-l pb-2 pl-4">
				<AppText className="text-foreground-weak text-xs">
					No projects yet
				</AppText>
			</View>
		);
	}

	const effectiveRowHeight = Math.max(rowHeight - 8, 40);

	return (
		<View className="ml-4 gap-3 border-border border-l pb-2 pl-4">
			{projectGroups.map((projectGroup) => (
				<View key={projectGroup.title} className="gap-1">
					<ProjectSectionHeader title={projectGroup.title} variant="sidebar" />
					{projectGroup.rows.map((project) => (
						<ProjectRow
							key={project.id}
							name={project.name}
							status={project.status}
							lastUsed={project.lastUsed}
							height={effectiveRowHeight}
							isSelected={project.id === selectedProjectId}
							onPress={() => onSelectProject(project.id, project.worktree)}
							variant="sidebar"
						/>
					))}
				</View>
			))}
		</View>
	);
}

import { AppText } from "@/components/app-text";

interface PageProjectsListProps {
	projectGroups: ProjectGroup[];
	listState: ListState;
	isAgentUnhealthy: boolean;
	selectedProjectId: string | null;
	onSelectProject: (id: string, worktree?: string) => void;
	rowHeight: number;
	nextHref?: Href;
	headerComponent?: React.ReactNode;
}

function PageProjectsList({
	projectGroups,
	listState,
	isAgentUnhealthy,
	selectedProjectId,
	onSelectProject,
	rowHeight,
	nextHref,
	headerComponent,
}: PageProjectsListProps) {
	const sections =
		listState === "ready"
			? projectGroups.map((group) => ({
					title: group.title,
					data: group.rows,
				}))
			: [];

	return (
		<SectionList
			testID="projects-list"
			sections={sections}
			keyExtractor={(item) => item.id}
			className="flex-1 bg-background"
			contentContainerStyle={{ padding: 16 }}
			ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
			renderItem={({ item: project }) => (
				<ProjectRow
					key={project.id}
					name={project.name}
					status={project.status}
					lastUsed={project.lastUsed}
					height={rowHeight}
					isSelected={project.id === selectedProjectId}
					onPress={() => onSelectProject(project.id, project.worktree)}
					variant="page"
					href={nextHref}
				/>
			)}
			renderSectionHeader={({ section }) => (
				<ProjectSectionHeader title={section.title} variant="page" />
			)}
			ListHeaderComponent={
				<View className="mb-4">
					{headerComponent}
					{listState === "error" && (
						<View className="mt-3">
							{isAgentUnhealthy ? (
								<AgentUnavailableBanner />
							) : (
								<ErrorBanner
									title="Server offline"
									subtitle="OpenCode server is unreachable."
									ctaLabel="Retry"
								/>
							)}
						</View>
					)}
				</View>
			}
			ListEmptyComponent={
				listState === "loading" ? (
					<LoadingList count={5} rowHeight={rowHeight} />
				) : listState === "empty" ? (
					<EmptyStateCard
						title="No projects yet"
						subtitle="Open Coder or check the server connection."
						ctaLabel="Open Coder"
					/>
				) : null
			}
		/>
	);
}
