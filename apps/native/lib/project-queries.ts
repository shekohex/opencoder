import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { useSession } from "@/lib/auth";
import { useWildcardAccessUrl } from "@/lib/deployment-config";
import {
	createCoderOpenCodeClient,
	listOpenCodeProjects,
} from "@/lib/opencode-client";
import { isOpenCodeUrlError, resolveOpenCodeUrl } from "@/lib/workspace-apps";
import { useWorkspaces } from "@/lib/workspace-queries";

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
	const { session, baseUrl: coderBaseUrl } = useSession();
	const { data: workspaces } = useWorkspaces();
	const { wildcardAccessUrl, isLoading: isLoadingConfig } =
		useWildcardAccessUrl();

	const workspace = useMemo(() => {
		if (!workspaceId || !workspaces) return null;
		return workspaces.find((ws) => ws.id === workspaceId) ?? null;
	}, [workspaceId, workspaces]);

	const openCodeUrlResult = useMemo(() => {
		if (!workspace || !coderBaseUrl) return null;
		return resolveOpenCodeUrl(coderBaseUrl, workspace, wildcardAccessUrl);
	}, [workspace, coderBaseUrl, wildcardAccessUrl]);

	const query = useQuery({
		queryKey: projectsQueryKey(workspaceId),
		queryFn: async () => {
			if (!openCodeUrlResult) {
				throw new Error("Cannot resolve OpenCode URL");
			}
			if (isOpenCodeUrlError(openCodeUrlResult)) {
				throw new Error(openCodeUrlResult.message);
			}

			if (!session) {
				throw new Error("No session token available");
			}

			const client = createCoderOpenCodeClient({
				baseUrl: openCodeUrlResult.baseUrl,
				sessionToken: session,
			});

			const projects = await listOpenCodeProjects(client);
			return projects.map(projectToRowData);
		},
		enabled:
			!!workspaceId &&
			!!workspace &&
			!!session &&
			!!openCodeUrlResult &&
			!isOpenCodeUrlError(openCodeUrlResult) &&
			!isLoadingConfig,
		staleTime: 30 * 1000,
		gcTime: 5 * 60 * 1000,
	});

	const projectGroups = useMemo(() => {
		return groupProjects(query.data ?? []);
	}, [query.data]);

	const openCodeError = useMemo(() => {
		if (!openCodeUrlResult) return null;
		if (isOpenCodeUrlError(openCodeUrlResult)) {
			return openCodeUrlResult;
		}
		return null;
	}, [openCodeUrlResult]);

	return {
		projects: query.data ?? [],
		projectGroups,
		isLoading: query.isLoading,
		isError: query.isError || !!openCodeError,
		error: query.error ?? openCodeError,
		refetch: query.refetch,
	};
}
