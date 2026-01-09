import type { Href } from "expo-router";
import { parseAsString, useQueryState } from "nuqs";

export const workspaceParamKeys = {
	workspace: "ws",
	project: "proj",
	worktree: "wt",
	session: "sess",
} as const;

export type WorkspaceNavLevel = "workspaces" | "projects" | "sessions" | "chat";

export function buildWorkspaceHref(
	basePath: string,
	params: {
		workspaceId?: string | null;
		projectId?: string | null;
		worktree?: string | null;
		sessionId?: string | null;
	},
): Href {
	const searchParams = new URLSearchParams();

	if (params.workspaceId) {
		searchParams.set(workspaceParamKeys.workspace, params.workspaceId);
	}
	if (params.projectId) {
		searchParams.set(workspaceParamKeys.project, params.projectId);
	}
	if (params.worktree) {
		searchParams.set(workspaceParamKeys.worktree, params.worktree);
	}
	if (params.sessionId) {
		searchParams.set(workspaceParamKeys.session, params.sessionId);
	}

	const queryString = searchParams.toString();
	return (queryString ? `${basePath}?${queryString}` : basePath) as Href;
}

export function useWorkspaceQueryParams() {
	const [workspaceId, setWorkspaceId] = useQueryState(
		workspaceParamKeys.workspace,
		parseAsString,
	);
	const [projectId, setProjectId] = useQueryState(
		workspaceParamKeys.project,
		parseAsString,
	);
	const [worktree, setWorktree] = useQueryState(
		workspaceParamKeys.worktree,
		parseAsString,
	);
	const [sessionId, setSessionId] = useQueryState(
		workspaceParamKeys.session,
		parseAsString,
	);

	return {
		workspaceId,
		projectId,
		worktree,
		sessionId,
		setWorkspaceId,
		setProjectId,
		setWorktree,
		setSessionId,
	};
}
