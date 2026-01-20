import { describe, expect, it, jest } from "@jest/globals";
import type { OpencodeClient } from "@opencode-ai/sdk";

import { useCreateSession, useSendMessage } from "../chat-mutations";

describe("Chat Mutations", () => {
	describe("sendMessage", () => {
		it("sends message to session", async () => {
			const mockClient = {
				session: {
					prompt: jest.fn().mockResolvedValue({
						data: {
							id: "msg-1",
							role: "user",
							parts: [{ type: "text", text: "hello" }],
						},
					}),
				},
			} as unknown as OpencodeClient;

			const sendMessage = useSendMessage(mockClient, "session-123");
			const result = await sendMessage.mutateAsync("hello");

			expect(mockClient.session.prompt).toHaveBeenCalledWith({
				path: { id: "session-123" },
				body: { parts: [{ type: "text", text: "hello" }] },
			});
			expect(result?.id).toBe("msg-1");
		});

		it("handles empty string error", async () => {
			const mockClient = {
				session: {
					prompt: jest.fn(),
				},
			} as unknown as OpencodeClient;

			const sendMessage = useSendMessage(mockClient, "session-123");

			try {
				await sendMessage.mutateAsync("");
			} catch (e) {
				expect(e).toBeInstanceOf(Error);
			}

			expect(mockClient.session.prompt).not.toHaveBeenCalled();
		});

		it("handles API errors", async () => {
			const mockClient = {
				session: {
					prompt: jest.fn().mockRejectedValue(new Error("Network error")),
				},
			} as unknown as OpencodeClient;

			const sendMessage = useSendMessage(mockClient, "session-123");

			try {
				await sendMessage.mutateAsync("hello");
				expect(true).toBe(false);
			} catch (e) {
				expect((e as Error).message).toBe("Network error");
			}
		});
	});

	describe("createSession", () => {
		it("creates new session", async () => {
			const mockClient = {
				session: {
					create: jest.fn().mockResolvedValue({
						data: {
							id: "session-123",
							created_at: "2025-01-20T00:00:00Z",
							status: "detached",
						},
					}),
				},
			} as unknown as OpencodeClient;

			const createSession = useCreateSession(
				mockClient,
				"workspace-123",
				"/test",
			);
			const result = await createSession.mutateAsync({});

			expect(mockClient.session.create).toHaveBeenCalledWith({
				query: { directory: "/test" },
				body: {},
			});
			expect(result?.id).toBe("session-123");
		});

		it("creates session with title", async () => {
			const mockClient = {
				session: {
					create: jest.fn().mockResolvedValue({
						data: {
							id: "session-123",
							title: "My Session",
							created_at: "2025-01-20T00:00:00Z",
							status: "detached",
						},
					}),
				},
			} as unknown as OpencodeClient;

			const createSession = useCreateSession(
				mockClient,
				"workspace-123",
				"/test",
			);
			const result = await createSession.mutateAsync({
				title: "My Session",
			});

			expect(mockClient.session.create).toHaveBeenCalledWith({
				query: { directory: "/test" },
				body: { title: "My Session" },
			});
			expect(result?.title).toBe("My Session");
		});

		it("handles API errors", async () => {
			const mockClient = {
				session: {
					create: jest.fn().mockRejectedValue(new Error("Failed to create")),
				},
			} as unknown as OpencodeClient;

			const createSession = useCreateSession(
				mockClient,
				"workspace-123",
				"/test",
			);

			try {
				await createSession.mutateAsync({});
				expect(true).toBe(false);
			} catch (e) {
				expect((e as Error).message).toBe("Failed to create");
			}
		});
	});
});
