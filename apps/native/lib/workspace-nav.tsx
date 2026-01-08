import { createContext, type ReactNode, useContext, useState } from "react";

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
	const [selectedWorkspaceId, _setSelectedWorkspaceId] =
		useState<WorkspaceId>(null);
	const [selectedProjectId, _setSelectedProjectId] = useState<ProjectId>(null);
	const [selectedProjectWorktree, _setSelectedProjectWorktree] =
		useState<ProjectWorktree>(null);
	const [selectedSessionId, setSelectedSessionId] = useState<SessionId>(null);

	const setSelectedWorkspaceId = (id: WorkspaceId) => {
		_setSelectedWorkspaceId(id);
		_setSelectedProjectId(null);
		_setSelectedProjectWorktree(null);
		setSelectedSessionId(null);
	};

	const setSelectedProjectId = (id: ProjectId, worktree?: string) => {
		_setSelectedProjectId(id);
		_setSelectedProjectWorktree(worktree ?? null);
		setSelectedSessionId(null);
	};

	const clearSelection = () => {
		_setSelectedWorkspaceId(null);
		_setSelectedProjectId(null);
		_setSelectedProjectWorktree(null);
		setSelectedSessionId(null);
	};

	return (
		<WorkspaceNavContext.Provider
			value={{
				selectedWorkspaceId,
				selectedProjectId,
				selectedProjectWorktree,
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
