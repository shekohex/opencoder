import { createContext, type ReactNode, useContext } from "react";

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
	const {
		workspaceId,
		projectId,
		worktree,
		sessionId,
		setWorkspaceId,
		setProjectId,
		setWorktree,
		setSessionId,
	} = useWorkspaceQueryParams();

	const setSelectedWorkspaceId = (id: WorkspaceId) => {
		setWorkspaceId(id);
		setProjectId(null);
		setWorktree(null);
		setSessionId(null);
	};

	const setSelectedProjectId = (id: ProjectId, worktree?: string) => {
		setProjectId(id);
		setWorktree(worktree ?? null);
		setSessionId(null);
	};

	const setSelectedSessionId = setSessionId;

	const clearSelection = () => {
		setWorkspaceId(null);
		setProjectId(null);
		setWorktree(null);
		setSessionId(null);
	};

	return (
		<WorkspaceNavContext.Provider
			value={{
				selectedWorkspaceId: workspaceId,
				selectedProjectId: projectId,
				selectedProjectWorktree: worktree,
				selectedSessionId: sessionId,
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
