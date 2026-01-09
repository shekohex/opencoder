import { buildTitle, type TitleSegments } from "./use-document-title";

describe("buildTitle", () => {
	describe("no selection", () => {
		it("returns default title when all segments are null", () => {
			const segments: TitleSegments = {
				session: null,
				project: null,
				workspace: null,
			};
			expect(buildTitle(segments)).toBe("Workspaces | opencoder");
		});

		it("returns default title when all segments are undefined", () => {
			const segments: TitleSegments = {};
			expect(buildTitle(segments)).toBe("Workspaces | opencoder");
		});

		it("returns default title when all segments are empty strings", () => {
			const segments: TitleSegments = {
				session: "",
				project: "",
				workspace: "",
			};
			expect(buildTitle(segments)).toBe("Workspaces | opencoder");
		});
	});

	describe("workspace only", () => {
		it("returns workspace | opencoder when only workspace is set", () => {
			const segments: TitleSegments = {
				workspace: "my-workspace",
			};
			expect(buildTitle(segments)).toBe("my-workspace | opencoder");
		});

		it("ignores null/undefined session and project", () => {
			const segments: TitleSegments = {
				session: null,
				project: undefined,
				workspace: "lionzhd",
			};
			expect(buildTitle(segments)).toBe("lionzhd | opencoder");
		});
	});

	describe("project + workspace", () => {
		it("returns project | workspace | opencoder", () => {
			const segments: TitleSegments = {
				project: "my-project",
				workspace: "my-workspace",
			};
			expect(buildTitle(segments)).toBe(
				"my-project | my-workspace | opencoder",
			);
		});

		it("ignores null session", () => {
			const segments: TitleSegments = {
				session: null,
				project: "opencoder",
				workspace: "lionzhd",
			};
			expect(buildTitle(segments)).toBe("opencoder | lionzhd | opencoder");
		});
	});

	describe("session + project + workspace (full title)", () => {
		it("returns session | project | workspace | opencoder", () => {
			const segments: TitleSegments = {
				session: "Feature discussion",
				project: "my-project",
				workspace: "my-workspace",
			};
			expect(buildTitle(segments)).toBe(
				"Feature discussion | my-project | my-workspace | opencoder",
			);
		});

		it("handles all segments with special characters", () => {
			const segments: TitleSegments = {
				session: "Bug fix #123",
				project: "my-app-v2",
				workspace: "dev_workspace",
			};
			expect(buildTitle(segments)).toBe(
				"Bug fix #123 | my-app-v2 | dev_workspace | opencoder",
			);
		});
	});

	describe("partial selections (edge cases)", () => {
		it("returns session | opencoder when only session is set (unusual)", () => {
			const segments: TitleSegments = {
				session: "orphan-session",
			};
			expect(buildTitle(segments)).toBe("orphan-session | opencoder");
		});

		it("returns project | opencoder when only project is set (no workspace)", () => {
			const segments: TitleSegments = {
				project: "standalone-project",
			};
			expect(buildTitle(segments)).toBe("standalone-project | opencoder");
		});

		it("returns session | workspace | opencoder when project is null", () => {
			const segments: TitleSegments = {
				session: "my-session",
				project: null,
				workspace: "my-workspace",
			};
			expect(buildTitle(segments)).toBe(
				"my-session | my-workspace | opencoder",
			);
		});

		it("returns session | project | opencoder when workspace is null", () => {
			const segments: TitleSegments = {
				session: "my-session",
				project: "my-project",
				workspace: null,
			};
			expect(buildTitle(segments)).toBe("my-session | my-project | opencoder");
		});
	});

	describe("whitespace handling", () => {
		it("includes segments with whitespace in names", () => {
			const segments: TitleSegments = {
				session: "New Session",
				project: "My Project",
				workspace: "Work Space",
			};
			expect(buildTitle(segments)).toBe(
				"New Session | My Project | Work Space | opencoder",
			);
		});

		it("treats whitespace-only strings as falsy (empty)", () => {
			const segments: TitleSegments = {
				session: "   ",
				project: "my-project",
				workspace: "my-workspace",
			};
			expect(buildTitle(segments)).toBe(
				"    | my-project | my-workspace | opencoder",
			);
		});
	});

	describe("real-world scenarios", () => {
		it("handles typical workspace selection flow", () => {
			expect(buildTitle({})).toBe("Workspaces | opencoder");

			expect(buildTitle({ workspace: "lionzhd" })).toBe("lionzhd | opencoder");

			expect(buildTitle({ workspace: "lionzhd", project: "opencoder" })).toBe(
				"opencoder | lionzhd | opencoder",
			);

			expect(
				buildTitle({
					workspace: "lionzhd",
					project: "opencoder",
					session: "Sidebar redesign",
				}),
			).toBe("Sidebar redesign | opencoder | lionzhd | opencoder");
		});

		it("handles deselection flow", () => {
			const full: TitleSegments = {
				session: "My Session",
				project: "my-project",
				workspace: "my-workspace",
			};
			expect(buildTitle(full)).toBe(
				"My Session | my-project | my-workspace | opencoder",
			);

			const noSession: TitleSegments = {
				...full,
				session: null,
			};
			expect(buildTitle(noSession)).toBe(
				"my-project | my-workspace | opencoder",
			);

			const noProject: TitleSegments = {
				...noSession,
				project: null,
			};
			expect(buildTitle(noProject)).toBe("my-workspace | opencoder");

			const empty: TitleSegments = {
				...noProject,
				workspace: null,
			};
			expect(buildTitle(empty)).toBe("Workspaces | opencoder");
		});
	});
});
