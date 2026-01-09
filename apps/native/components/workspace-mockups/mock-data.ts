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

export const workspaceGroups: {
	owner: string;
	ownerInitials: string;
	rows: WorkspaceRowData[];
}[] = [
	{
		owner: "Alex Chen",
		ownerInitials: "AC",
		rows: [
			{
				name: "core-platform",
				status: "Running",
				statusTone: "success" as StatusTone,
				lastUsed: "2h ago",
				badges: ["favorite"],
			},
			{
				name: "docs-refresh",
				status: "Starting",
				statusTone: "warning" as StatusTone,
				lastUsed: "just now",
				badges: ["task"],
			},
		],
	},
	{
		owner: "Design Guild",
		ownerInitials: "DG",
		rows: [
			{
				name: "design-kit",
				status: "Stopped",
				statusTone: "inactive" as StatusTone,
				lastUsed: "3d ago",
				badges: ["shared", "outdated"],
			},
			{
				name: "mobile-audit",
				status: "Running",
				statusTone: "success" as StatusTone,
				lastUsed: "30m ago",
				badges: ["shared"],
			},
		],
	},
];

export const projectGroups = [
	{
		title: "Pinned",
		rows: [
			{ name: "opencode", status: "Active", lastUsed: "5m" },
			{ name: "native-shell", status: "Idle", lastUsed: "2h" },
		],
	},
	{
		title: "Recent",
		rows: [
			{ name: "api-gateway", status: "Queued", lastUsed: "1d" },
			{ name: "design-system", status: "Idle", lastUsed: "3d" },
		],
	},
];

export const sessionRows = [
	{ name: "Workspace nav", status: "Live", lastUsed: "2m" },
	{ name: "Bug triage", status: "Idle", lastUsed: "1h" },
	{ name: "Sprint planning", status: "Idle", lastUsed: "1d" },
];

export const messageRows = [
	{ role: "user", text: "Show me workspace status changes in one view." },
	{
		role: "assistant",
		text: "Got it. Status pills and last used timestamps are ready.",
	},
	{ role: "user", text: "Add a strong empty state for new teams." },
];

export const buildStatus = {
	title: "Build in progress",
	detail: "deploy-preview-214 · 2m elapsed",
	stage: "Bundling assets",
};

export const emptyStateActions = [
	"Create workspace",
	"Invite teammates",
	"Import repo",
];
