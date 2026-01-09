import type { Href } from "expo-router";
import { parseAsString, useQueryState } from "nuqs";

import { sidebarParamKeys } from "./sidebar-state";

export const workspaceParamKeys = {
	worktree: "wt",
} as const;

export type WorkspaceNavLevel = "workspaces" | "projects" | "sessions" | "chat";

export type WorkspacePathParams = {
	workspaceId?: string | null;
	projectId?: string | null;
	sessionId?: string | null;
	worktree?: string | null;
	sessionsExpanded?: boolean;
};

export function buildWorkspacePath(params: WorkspacePathParams): Href {
	const { workspaceId, projectId, sessionId, worktree, sessionsExpanded } =
		params;

	const segments = ["/workspaces"];
	if (workspaceId) segments.push(workspaceId);
	if (workspaceId && projectId) segments.push(projectId);
	if (workspaceId && projectId && sessionId) segments.push(sessionId);

	const pathname = segments.join("/");
	const searchParams = new URLSearchParams();

	if (worktree) {
		searchParams.set(workspaceParamKeys.worktree, worktree);
	}

	if (sessionsExpanded !== undefined) {
		searchParams.set(
			sidebarParamKeys.sessionsCollapsed,
			String(!sessionsExpanded),
		);
	}

	const search = searchParams.toString();
	return (search ? `${pathname}?${search}` : pathname) as Href;
}

export function useWorktreeParam() {
	const [worktree, setWorktree] = useQueryState(
		workspaceParamKeys.worktree,
		parseAsString,
	);
	return { worktree, setWorktree };
}
