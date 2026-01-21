import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

describe("workspace-list folder structure", () => {
	it("should not import from workspace-mockups", () => {
		const files = [
			"app/(app)/(drawer)/workspaces/[workspaceId]/mobile.tsx",
			"app/(app)/(drawer)/workspaces/mobile.tsx",
			"components/sidebar/desktop-shell.tsx",
			"app/(app)/(drawer)/workspaces/[workspaceId]/index.web.tsx",
			"app/(app)/(drawer)/workspaces/[workspaceId]/[projectId]/[sessionId]/index.web.tsx",
			"app/(app)/(drawer)/workspaces/[workspaceId]/[projectId]/index.web.tsx",
			"app/(app)/(drawer)/workspaces/[workspaceId]/[projectId]/mobile.tsx",
			"app/(app)/(drawer)/workspaces/index.tsx",
			"app/(app)/(drawer)/workspaces/index.web.tsx",
			"lib/workspace-queries.ts",
			"components/workspace-list/shared.tsx",
			"components/workspace-list/workspace-card.tsx",
			"components/workspace-list/workspace-item.tsx",
		];

		for (const file of files) {
			const content = readFileSync(join(process.cwd(), file), "utf-8");
			expect(content).not.toContain("workspace-mockups");
		}
	});

	it("should have workspace-list folder", () => {
		expect(existsSync(join(process.cwd(), "components/workspace-list"))).toBe(
			true,
		);
	});
});
