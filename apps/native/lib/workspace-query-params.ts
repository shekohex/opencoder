import { parseAsString, useQueryState } from "nuqs";

export const workspaceParamKeys = {
	workspace: "ws",
	project: "proj",
	worktree: "wt",
	session: "sess",
} as const;

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
