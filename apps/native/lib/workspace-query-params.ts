import type { Href } from "expo-router";
import { parseAsString, useQueryState } from "nuqs";

export const workspaceParamKeys = {
	workspace: "ws",
	project: "proj",
	worktree: "wt",
	session: "sess",
} as const;

export type WorkspaceNavLevel = "workspaces" | "projects" | "sessions" | "chat";

export function buildWorkspacePath(params: {
	workspaceId?: string | null;
	projectId?: string | null;
	sessionId?: string | null;
	worktree?: string | null;
}): Href {
	const { workspaceId, projectId, sessionId, worktree } = params;

	let path = "/workspaces";

	if (workspaceId) {
		path = `${path}/${workspaceId}`;
		if (projectId) {
			path = `${path}/${projectId}`;
			if (sessionId) {
				path = `${path}/${sessionId}`;
			}
		}
	}

	if (worktree) {
		const encoded = encodeURIComponent(worktree);
		path = `${path}?${workspaceParamKeys.worktree}=${encoded}`;
	}

	return path as Href;
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
