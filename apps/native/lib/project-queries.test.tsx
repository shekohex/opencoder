import {
	groupProjects,
	type ProjectRowData,
	projectToRowData,
} from "./project-queries";

type OpenCodeProject = {
	id: string;
	worktree: string;
	vcsDir?: string;
	vcs?: "git";
	time: {
		created: number;
		initialized?: number;
	};
};

const createMockProject = (
	overrides: Partial<OpenCodeProject> = {},
): OpenCodeProject => ({
	id: "proj-123",
	worktree: "/home/coder/projects/my-app",
	time: {
		created: Math.floor(Date.now() / 1000) - 3600,
	},
	...overrides,
});

describe("project-queries", () => {
	describe("projectToRowData", () => {
		it("maps project to row data", () => {
			const project = createMockProject({
				id: "proj-456",
				worktree: "/home/coder/workspace/opencode",
			});

			const row = projectToRowData(project);

			expect(row.id).toBe("proj-456");
			expect(row.name).toBe("opencode");
			expect(row.worktree).toBe("/home/coder/workspace/opencode");
			expect(row.status).toBe("Active");
		});

		it("extracts name from worktree path", () => {
			const project = createMockProject({
				worktree: "/a/deeply/nested/path/to/my-project",
			});

			const row = projectToRowData(project);

			expect(row.name).toBe("my-project");
		});

		it("handles single segment worktree", () => {
			const project = createMockProject({
				worktree: "/home",
			});

			const row = projectToRowData(project);

			expect(row.name).toBe("home");
		});

		it("formats lastUsed from initialized time", () => {
			const oneHourAgo = Math.floor(Date.now() / 1000) - 3600;
			const project = createMockProject({
				time: {
					created: oneHourAgo - 7200,
					initialized: oneHourAgo,
				},
			});

			const row = projectToRowData(project);

			expect(row.lastUsed).toBe("1h");
		});

		it("formats lastUsed from created time if not initialized", () => {
			const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 300;
			const project = createMockProject({
				time: {
					created: fiveMinutesAgo,
				},
			});

			const row = projectToRowData(project);

			expect(row.lastUsed).toBe("5m");
		});

		it("formats lastUsed as just now for recent projects", () => {
			const justNow = Math.floor(Date.now() / 1000);
			const project = createMockProject({
				time: {
					created: justNow,
				},
			});

			const row = projectToRowData(project);

			expect(row.lastUsed).toBe("just now");
		});

		it("formats lastUsed in days for old projects", () => {
			const threeDaysAgo = Math.floor(Date.now() / 1000) - 3 * 24 * 3600;
			const project = createMockProject({
				time: {
					created: threeDaysAgo,
				},
			});

			const row = projectToRowData(project);

			expect(row.lastUsed).toBe("3d");
		});
	});

	describe("groupProjects", () => {
		it("returns empty array for empty input", () => {
			const groups = groupProjects([]);

			expect(groups).toHaveLength(0);
		});

		it("returns single group for all projects", () => {
			const projects: ProjectRowData[] = [
				{
					id: "p1",
					name: "project-a",
					status: "Active",
					lastUsed: "1h",
					worktree: "/home/coder/project-a",
				},
				{
					id: "p2",
					name: "project-b",
					status: "Active",
					lastUsed: "2d",
					worktree: "/home/coder/project-b",
				},
			];

			const groups = groupProjects(projects);

			expect(groups).toHaveLength(1);
			expect(groups[0].title).toBe("All Projects");
			expect(groups[0].rows).toHaveLength(2);
		});

		it("preserves project order in group", () => {
			const projects: ProjectRowData[] = [
				{
					id: "p1",
					name: "alpha",
					status: "Active",
					lastUsed: "1h",
					worktree: "/alpha",
				},
				{
					id: "p2",
					name: "beta",
					status: "Active",
					lastUsed: "2h",
					worktree: "/beta",
				},
				{
					id: "p3",
					name: "gamma",
					status: "Active",
					lastUsed: "3h",
					worktree: "/gamma",
				},
			];

			const groups = groupProjects(projects);

			expect(groups[0].rows[0].name).toBe("alpha");
			expect(groups[0].rows[1].name).toBe("beta");
			expect(groups[0].rows[2].name).toBe("gamma");
		});
	});
});
