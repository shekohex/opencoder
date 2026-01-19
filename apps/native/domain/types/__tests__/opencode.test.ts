import { describe, expect, it } from "bun:test";
import type {
	FileDiff,
	Message,
	MessageRole,
	Part,
	Permission,
	Session,
} from "@/domain/types";

describe("OpenCode Domain Types", () => {
	describe("Message", () => {
		it("should have required fields", () => {
			const userMsg: Message = {
				id: "msg-1",
				sessionID: "sess-1",
				role: "user",
				time: { created: Date.now() },
				agent: "claude",
				model: { providerID: "anthropic", modelID: "claude-3" },
			};

			expect(userMsg.id).toBe("msg-1");
			expect(userMsg.role).toBe("user");
		});

		it("should support user role", () => {
			const role: MessageRole = "user";
			expect(role).toBe("user");
		});

		it("should support assistant role", () => {
			const role: MessageRole = "assistant";
			expect(role).toBe("assistant");
		});
	});

	describe("Session", () => {
		it("should have required fields", () => {
			const session: Session = {
				id: "sess-1",
				title: "Test Session",
				status: "idle",
				time: { created: Date.now() },
			};

			expect(session.id).toBe("sess-1");
			expect(session.title).toBe("Test Session");
		});

		it("should support all status values", () => {
			const statuses: Array<Session["status"]> = [
				"idle",
				"busy",
				"input",
				"aborting",
				"done",
				"error",
			];
			expect(statuses).toHaveLength(6);
		});
	});

	describe("Permission", () => {
		it("should have required fields", () => {
			const permission: Permission = {
				id: "perm-1",
				sessionID: "sess-1",
				messageID: "msg-1",
				type: "tool",
				title: "Read file",
				body: "Allow reading /path/to/file",
				time: { created: Date.now() },
			};

			expect(permission.id).toBe("perm-1");
			expect(permission.type).toBe("tool");
		});
	});

	describe("Part types", () => {
		it("should support text parts", () => {
			const part: Part = {
				id: "part-1",
				sessionID: "sess-1",
				messageID: "msg-1",
				type: "text",
				text: "Hello world",
			};
			expect(part.type).toBe("text");
		});

		it("should support tool parts", () => {
			const part: Part = {
				id: "part-2",
				sessionID: "sess-1",
				messageID: "msg-1",
				type: "tool",
				tool: "read_file",
				input: { path: "/test.txt" },
			};
			expect(part.type).toBe("tool");
		});
	});

	describe("FileDiff", () => {
		it("should have diff fields", () => {
			const diff: FileDiff = {
				file: "/path/to/file.ts",
				before: "old content",
				after: "new content",
				additions: 5,
				deletions: 2,
			};

			expect(diff.file).toBe("/path/to/file.ts");
			expect(diff.additions).toBe(5);
			expect(diff.deletions).toBe(2);
		});
	});
});
