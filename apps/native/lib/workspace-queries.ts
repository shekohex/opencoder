import { API, type TypesGen } from "@coder/sdk";
import { useQuery } from "@tanstack/react-query";

export type StatusTone = "success" | "warning" | "inactive" | "error";
export type WorkspaceBadge = "favorite" | "outdated" | "task" | "shared";

export type WorkspaceRowData = {
	id?: string;
	name: string;
	status: string;
	statusTone: StatusTone;
	lastUsed: string;
	badges: WorkspaceBadge[];
};

export const workspacesQueryKey = ["workspaces"] as const;

export function useWorkspaces() {
	return useQuery({
		queryKey: workspacesQueryKey,
		queryFn: () => API.getWorkspaces(),
		select: (data) => data.workspaces,
	});
}

function getAgentHealth(
	workspace: TypesGen.Workspace,
): { healthy: boolean; reason?: string } | null {
	const resources = workspace.latest_build?.resources;
	if (!resources) return null;

	for (const resource of resources) {
		const agents = resource.agents;
		if (!agents) continue;
		for (const agent of agents) {
			if (agent.status !== "connected") {
				return { healthy: false, reason: `Agent ${agent.status}` };
			}
			if (agent.health && !agent.health.healthy) {
				return { healthy: false, reason: agent.health.reason };
			}
		}
	}
	return { healthy: true };
}

function getStatusTone(
	status: TypesGen.WorkspaceStatus,
	agentHealthy: boolean,
): StatusTone {
	if (status === "running" && !agentHealthy) {
		return "error";
	}
	switch (status) {
		case "running":
			return "success";
		case "starting":
		case "stopping":
		case "pending":
		case "canceling":
		case "deleting":
			return "warning";
		default:
			return "inactive";
	}
}

function formatLastUsed(lastUsedAt: string): string {
	const lastUsed = new Date(lastUsedAt);
	const now = new Date();
	const diffMs = now.getTime() - lastUsed.getTime();
	const diffMinutes = Math.floor(diffMs / (1000 * 60));
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffMinutes < 1) return "just now";
	if (diffMinutes < 60) return `${diffMinutes}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;
	return `${diffDays}d ago`;
}

function formatStatusLabel(status: TypesGen.WorkspaceStatus): string {
	return status.charAt(0).toUpperCase() + status.slice(1);
}

function getWorkspaceBadges(workspace: TypesGen.Workspace): WorkspaceBadge[] {
	const badges: WorkspaceBadge[] = [];

	if (workspace.favorite) {
		badges.push("favorite");
	}
	if (workspace.outdated) {
		badges.push("outdated");
	}
	if (workspace.task_id) {
		badges.push("task");
	}
	if (workspace.shared_with && workspace.shared_with.length > 0) {
		badges.push("shared");
	}

	return badges;
}

export function workspaceToRowData(
	workspace: TypesGen.Workspace,
): WorkspaceRowData {
	const status = workspace.latest_build.status;
	const agentHealth = getAgentHealth(workspace);
	const isAgentHealthy = agentHealth?.healthy ?? true;

	let displayStatus = formatStatusLabel(status);
	if (status === "running" && !isAgentHealthy && agentHealth?.reason) {
		displayStatus = agentHealth.reason;
	}

	return {
		id: workspace.id,
		name: workspace.name,
		status: displayStatus,
		statusTone: getStatusTone(status, isAgentHealthy),
		lastUsed: formatLastUsed(workspace.last_used_at),
		badges: getWorkspaceBadges(workspace),
	};
}

function getOwnerInitials(ownerName: string): string {
	const parts = ownerName.split(/[\s_-]+/);
	if (parts.length >= 2) {
		return (parts[0][0] + parts[1][0]).toUpperCase();
	}
	return ownerName.slice(0, 2).toUpperCase();
}

export type WorkspaceGroup = {
	owner: string;
	ownerInitials: string;
	rows: WorkspaceRowData[];
};

export function groupWorkspacesByOwner(
	workspaces: readonly TypesGen.Workspace[],
): WorkspaceGroup[] {
	const grouped = new Map<string, TypesGen.Workspace[]>();

	for (const workspace of workspaces) {
		const owner = workspace.owner_name;
		const existing = grouped.get(owner);
		if (existing) {
			existing.push(workspace);
		} else {
			grouped.set(owner, [workspace]);
		}
	}

	const groups: WorkspaceGroup[] = [];
	for (const [owner, ownerWorkspaces] of grouped) {
		groups.push({
			owner,
			ownerInitials: getOwnerInitials(owner),
			rows: ownerWorkspaces.map(workspaceToRowData),
		});
	}

	return groups;
}

export function hasActiveBuilds(
	workspaces: readonly TypesGen.Workspace[],
): boolean {
	return workspaces.some((workspace) => {
		const status = workspace.latest_build.status;
		return (
			status === "starting" ||
			status === "stopping" ||
			status === "pending" ||
			status === "canceling" ||
			status === "deleting"
		);
	});
}

export function useWorkspaceName(workspaceId: string | null) {
	const { data: workspaces } = useWorkspaces();
	if (!workspaces || !workspaceId) return null;
	return workspaces.find((w) => w.id === workspaceId)?.name ?? null;
}
