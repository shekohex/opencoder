import { useGlobalSearchParams } from "expo-router";
import { createContext, type ReactNode, useCallback, useContext } from "react";

import { useWorkspaceQueryParams } from "./workspace-query-params";

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

export type WorkspaceNavActions = {
	setSelectedWorkspaceId: (id: WorkspaceId) => void;
	setSelectedProjectId: (id: ProjectId, worktree?: string) => void;
	setSelectedSessionId: (id: SessionId) => void;
	clearSelection: () => void;
};

type WorkspaceNavContextValue = WorkspaceNavState & WorkspaceNavActions;

const WorkspaceNavContext = createContext<WorkspaceNavContextValue | null>(
	null,
);

export function useWorkspaceNav() {
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

	const {
		workspaceId: queryWorkspaceId,
		projectId: queryProjectId,
		worktree,
		sessionId: querySessionId,
		setWorkspaceId,
		setProjectId,
		setWorktree,
		setSessionId,
	} = useWorkspaceQueryParams();

	const selectedWorkspaceId = routeParams.workspaceId ?? queryWorkspaceId;
	const selectedProjectId = routeParams.projectId ?? queryProjectId;
	const selectedSessionId = routeParams.sessionId ?? querySessionId;

	const setSelectedWorkspaceId = useCallback(
		(id: WorkspaceId) => {
			setWorkspaceId(id);
			setProjectId(null);
			setWorktree(null);
			setSessionId(null);
		},
		[setWorkspaceId, setProjectId, setWorktree, setSessionId],
	);

	const setSelectedProjectId = useCallback(
		(id: ProjectId, wt?: string) => {
			setProjectId(id);
			setWorktree(wt ?? null);
			setSessionId(null);
		},
		[setProjectId, setWorktree, setSessionId],
	);

	const setSelectedSessionId = setSessionId;

	const clearSelection = useCallback(() => {
		setWorkspaceId(null);
		setProjectId(null);
		setWorktree(null);
		setSessionId(null);
	}, [setWorkspaceId, setProjectId, setWorktree, setSessionId]);

	return (
		<WorkspaceNavContext.Provider
			value={{
				selectedWorkspaceId,
				selectedProjectId,
				selectedProjectWorktree: worktree,
				selectedSessionId,
				setSelectedWorkspaceId,
				setSelectedProjectId,
				setSelectedSessionId,
				clearSelection,
			}}
		>
			{children}
		</WorkspaceNavContext.Provider>
	);
}
