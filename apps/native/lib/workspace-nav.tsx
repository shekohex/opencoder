import { useGlobalSearchParams } from "expo-router";
import { createContext, type ReactNode, useContext } from "react";

import { useWorktreeParam } from "./workspace-query-params";

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

export function WorkspaceNavProvider({ children }: { children: ReactNode }) {
	const routeParams = useGlobalSearchParams<{
		workspaceId?: string;
		projectId?: string;
		sessionId?: string;
	}>();
	const { worktree } = useWorktreeParam();

	return (
		<WorkspaceNavContext.Provider
			value={{
				selectedWorkspaceId: routeParams.workspaceId ?? null,
				selectedProjectId: routeParams.projectId ?? null,
				selectedProjectWorktree: worktree,
				selectedSessionId: routeParams.sessionId ?? null,
			}}
		>
			{children}
		</WorkspaceNavContext.Provider>
	);
}
