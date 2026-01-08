import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

import { listOpenCodeProjects } from "@/lib/opencode-client";
import { useOpenCodeConnection } from "@/lib/opencode-provider";

export type ProjectRowData = {
	id: string;
	name: string;
	status: string;
	lastUsed: string;
	worktree: string;
};

export type ProjectGroup = {
	title: string;
	rows: ProjectRowData[];
};

type OpenCodeProject = {
	id: string;
	worktree: string;
	vcsDir?: string;
	vcs?: "git";
	time: {
		created: number;
		initialized?: number;
	};
};

function getProjectName(worktree: string): string {
	const segments = worktree.split("/").filter(Boolean);
	return segments[segments.length - 1] || worktree;
}

function formatProjectTime(time: {
	created: number;
	initialized?: number;
}): string {
	const timestamp = time.initialized ?? time.created;
	if (!timestamp) return "Unknown";

	const date = new Date(timestamp * 1000);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMinutes = Math.floor(diffMs / (1000 * 60));
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffMinutes < 1) return "just now";
	if (diffMinutes < 60) return `${diffMinutes}m`;
	if (diffHours < 24) return `${diffHours}h`;
	return `${diffDays}d`;
}

export function projectToRowData(project: OpenCodeProject): ProjectRowData {
	return {
		id: project.id,
		name: getProjectName(project.worktree),
		status: "Active",
		lastUsed: formatProjectTime(project.time),
		worktree: project.worktree,
	};
}

export function groupProjects(projects: ProjectRowData[]): ProjectGroup[] {
	if (projects.length === 0) return [];
	return [
		{
			title: "All Projects",
			rows: projects,
		},
	];
}

export const projectsQueryKey = (workspaceId: string | null) =>
	["opencode-projects", workspaceId] as const;

export function useOpenCodeProjects(workspaceId: string | null) {
	const {
		client,
		isConnected,
		isConnecting,
		connect,
		error: connectionError,
	} = useOpenCodeConnection(workspaceId);

	useEffect(() => {
		if (workspaceId && !isConnected && !isConnecting) {
			connect();
		}
	}, [workspaceId, isConnected, isConnecting, connect]);

	const query = useQuery({
		queryKey: projectsQueryKey(workspaceId),
		queryFn: async () => {
			if (!client) {
				throw new Error("OpenCode client not available");
			}
			const projects = await listOpenCodeProjects(client);
			return projects.map(projectToRowData);
		},
		enabled: !!workspaceId && !!client && isConnected,
		staleTime: 30 * 1000,
		gcTime: 5 * 60 * 1000,
	});

	const projectGroups = useMemo(() => {
		return groupProjects(query.data ?? []);
	}, [query.data]);

	return {
		projects: query.data ?? [],
		projectGroups,
		isLoading: query.isLoading || isConnecting,
		isError: query.isError || !!connectionError,
		error: query.error ?? connectionError,
		refetch: query.refetch,
	};
}
