import { useGlobalSearchParams, useRouter } from "expo-router";
import { createContext, type ReactNode, useCallback, useContext } from "react";

import { buildWorkspacePath, useWorktreeParam } from "./workspace-query-params";

export type WorkspaceId = string | null;
export type ProjectId = string | null;
export type SessionId = string | null;
export type ProjectWorktree = string | null;

export type WorkspaceNavState = {
	selectedWorkspaceId: WorkspaceId;
	selectedProjectId: ProjectId;
	selectedProjectWorktree: ProjectWorktree;
	selectedSessionId: SessionId;
};

const WorkspaceNavContext = createContext<WorkspaceNavState | null>(null);

export function useWorkspaceNav(): WorkspaceNavState {
	const context = useContext(WorkspaceNavContext);
	if (!context) {
		throw new Error("useWorkspaceNav must be used within WorkspaceNavProvider");
	}
	return context;
}

export function useWorkspaceNavigation() {
	const router = useRouter();
	const state = useWorkspaceNav();

	const navigateToWorkspace = useCallback(
		(workspaceId: string) => {
			router.replace(buildWorkspacePath({ workspaceId }));
		},
		[router],
	);

	const navigateToProject = useCallback(
		(projectId: string, worktree?: string) => {
			router.replace(
				buildWorkspacePath({
					workspaceId: state.selectedWorkspaceId,
					projectId,
					worktree,
				}),
			);
		},
		[router, state.selectedWorkspaceId],
	);

	const navigateToSession = useCallback(
		(sessionId: string) => {
			router.replace(
				buildWorkspacePath({
					workspaceId: state.selectedWorkspaceId,
					projectId: state.selectedProjectId,
					sessionId,
					worktree: state.selectedProjectWorktree,
				}),
			);
		},
		[
			router,
			state.selectedWorkspaceId,
			state.selectedProjectId,
			state.selectedProjectWorktree,
		],
	);

	const navigateToWorkspaces = useCallback(() => {
		router.replace(buildWorkspacePath({}));
	}, [router]);

	return {
		navigateToWorkspace,
		navigateToProject,
		navigateToSession,
		navigateToWorkspaces,
	};
}

export function WorkspaceNavProvider({ children }: { children: ReactNode }) {
	const routeParams = useGlobalSearchParams<{
		workspaceId?: string;
		projectId?: string;
		sessionId?: string;
	}>();

	const { worktree } = useWorktreeParam();

	const selectedWorkspaceId = routeParams.workspaceId ?? null;
	const selectedProjectId = routeParams.projectId ?? null;
	const selectedSessionId = routeParams.sessionId ?? null;

	return (
		<WorkspaceNavContext.Provider
			value={{
				selectedWorkspaceId,
				selectedProjectId,
				selectedProjectWorktree: worktree,
				selectedSessionId,
			}}
		>
			{children}
		</WorkspaceNavContext.Provider>
	);
}
