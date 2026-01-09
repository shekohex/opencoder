import type { Href } from "expo-router";
import { parseAsString, useQueryState } from "nuqs";

export const workspaceParamKeys = {
	worktree: "wt",
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

export function useWorktreeParam() {
	const [worktree, setWorktree] = useQueryState(
		workspaceParamKeys.worktree,
		parseAsString,
	);
	return { worktree, setWorktree };
}
