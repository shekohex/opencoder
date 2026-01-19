import { describe, expect, it } from "bun:test";
import type {
	ChatEvent,
	Event,
	EventType,
	PermissionEvent,
	PtyEvent,
	TodoEvent,
} from "@/domain/types";

describe("OpenCode Event Types", () => {
	describe("Event type discriminator", () => {
		it("should support message.updated event", () => {
			const event: Event = {
				type: "message.updated",
				properties: {
					info: {
						id: "msg-1",
						sessionID: "sess-1",
						role: "user",
						time: { created: Date.now() },
						agent: "claude",
						model: { providerID: "anthropic", modelID: "claude-3" },
					},
				},
			};
			expect(event.type).toBe("message.updated");
		});

		it("should support session.created event", () => {
			const event: Event = {
				type: "session.created",
				properties: {
					info: {
						id: "sess-1",
						title: "New Session",
						status: "idle",
						time: { created: Date.now() },
					},
				},
			};
			expect(event.type).toBe("session.created");
		});

		it("should support permission.updated event", () => {
			const event: Event = {
				type: "permission.updated",
				properties: {
					info: {
						id: "perm-1",
						sessionID: "sess-1",
						messageID: "msg-1",
						type: "tool",
						title: "Read file",
						body: "Allow reading file",
						time: { created: Date.now() },
					},
				},
			};
			expect(event.type).toBe("permission.updated");
		});

		it("should support pty.created event", () => {
			const event: Event = {
				type: "pty.created",
				properties: {
					info: {
						id: "pty-1",
						command: ["bash"],
						env: {},
						time: { created: Date.now() },
					},
				},
			};
			expect(event.type).toBe("pty.created");
		});

		it("should support todo.updated event", () => {
			const event: Event = {
				type: "todo.updated",
				properties: {
					sessionID: "sess-1",
					todo: [],
				},
			};
			expect(event.type).toBe("todo.updated");
		});
	});

	describe("Event category types", () => {
		it("should identify chat events", () => {
			const chatEvent: ChatEvent = {
				type: "message.updated",
				properties: {
					info: {
						id: "msg-1",
						sessionID: "sess-1",
						role: "user",
						time: { created: Date.now() },
						agent: "claude",
						model: { providerID: "anthropic", modelID: "claude-3" },
					},
				},
			};
			expect([
				"message.updated",
				"session.created",
				"session.status",
			]).toContain(chatEvent.type);
		});

		it("should identify permission events", () => {
			const permEvent: PermissionEvent = {
				type: "permission.updated",
				properties: {
					info: {
						id: "perm-1",
						sessionID: "sess-1",
						messageID: "msg-1",
						type: "tool",
						title: "Test",
						body: "Test body",
						time: { created: Date.now() },
					},
				},
			};
			expect(["permission.updated", "permission.replied"]).toContain(
				permEvent.type,
			);
		});

		it("should identify pty events", () => {
			const ptyEvent: PtyEvent = {
				type: "pty.created",
				properties: {
					info: {
						id: "pty-1",
						command: ["bash"],
						env: {},
						time: { created: Date.now() },
					},
				},
			};
			expect([
				"pty.created",
				"pty.updated",
				"pty.exited",
				"pty.deleted",
			]).toContain(ptyEvent.type);
		});

		it("should identify todo events", () => {
			const todoEvent: TodoEvent = {
				type: "todo.updated",
				properties: {
					sessionID: "sess-1",
					todo: [],
				},
			};
			expect(todoEvent.type).toBe("todo.updated");
		});
	});

	describe("EventType union", () => {
		it("should include all event types", () => {
			const types: EventType[] = [
				"message.updated",
				"session.created",
				"permission.updated",
				"pty.created",
				"todo.updated",
			];
			expect(types.length).toBeGreaterThan(0);
		});
	});
});
