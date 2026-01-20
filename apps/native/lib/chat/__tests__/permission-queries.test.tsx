import { describe, expect, it, jest } from "@jest/globals";
import type { OpencodeClient } from "@opencode-ai/sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import {
	usePendingPermissions,
	usePendingQuestions,
	usePermissionQueries,
	useQuestionQueries,
	useRespondToPermission,
	useRespondToQuestion,
} from "../permission-queries";

const mockClient = {
	permission: {
		list: jest.fn(),
		respond: jest.fn(),
	},
} as unknown as OpencodeClient;

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: false },
		},
	});
	return ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

describe("Permission Queries", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("usePendingPermissions", () => {
		it("fetches pending permissions for session", async () => {
			(mockClient.permission.list as jest.Mock).mockResolvedValue({
				data: [
					{
						id: "perm-1",
						sessionID: "session-123",
						type: "tool",
						title: "Run bash command",
						messageID: "msg-1",
						time: { created: Date.now() },
						metadata: { command: "ls -la" },
					},
				],
			});

			const { result } = renderHook(
				() => usePendingPermissions(mockClient, "session-123"),
				{ wrapper: createWrapper() },
			);

			await waitFor(() => expect(result.current.isLoading).toBe(false));

			expect(mockClient.permission.list).toHaveBeenCalledWith({
				path: { sessionId: "session-123" },
			});
			expect(result.current.permissions).toHaveLength(1);
			expect(result.current.permissions[0]?.id).toBe("perm-1");
		});

		it("returns empty array when no permissions", async () => {
			(mockClient.permission.list as jest.Mock).mockResolvedValue({
				data: [],
			});

			const { result } = renderHook(
				() => usePendingPermissions(mockClient, "session-123"),
				{ wrapper: createWrapper() },
			);

			await waitFor(() => expect(result.current.isLoading).toBe(false));

			expect(result.current.permissions).toEqual([]);
		});

		it("handles API errors", async () => {
			(mockClient.permission.list as jest.Mock).mockRejectedValue(
				new Error("Network error"),
			);

			const { result } = renderHook(
				() => usePendingPermissions(mockClient, "session-123"),
				{ wrapper: createWrapper() },
			);

			await waitFor(() => expect(result.current.isError).toBe(true));

			expect(result.current.error).toBeInstanceOf(Error);
		});

		it("disables query when no client provided", () => {
			const { result } = renderHook(
				() => usePendingPermissions(null, "session-123"),
				{ wrapper: createWrapper() },
			);

			expect(result.current.permissions).toEqual([]);
			expect(mockClient.permission.list).not.toHaveBeenCalled();
		});
	});

	describe("useRespondToPermission", () => {
		it("responds with allow once", async () => {
			(mockClient.permission.respond as jest.Mock).mockResolvedValue({
				data: { success: true },
			});

			const { result } = renderHook(() => useRespondToPermission(mockClient), {
				wrapper: createWrapper(),
			});

			await result.current.respondToPermission("session-123", "perm-1", "once");

			expect(mockClient.permission.respond).toHaveBeenCalledWith({
				path: { sessionId: "session-123", requestId: "perm-1" },
				body: { reply: "once" },
			});
		});

		it("responds with always", async () => {
			(mockClient.permission.respond as jest.Mock).mockResolvedValue({
				data: { success: true },
			});

			const { result } = renderHook(() => useRespondToPermission(mockClient), {
				wrapper: createWrapper(),
			});

			await result.current.respondToPermission(
				"session-123",
				"perm-1",
				"always",
			);

			expect(mockClient.permission.respond).toHaveBeenCalledWith({
				path: { sessionId: "session-123", requestId: "perm-1" },
				body: { reply: "always" },
			});
		});

		it("responds with reject", async () => {
			(mockClient.permission.respond as jest.Mock).mockResolvedValue({
				data: { success: true },
			});

			const { result } = renderHook(() => useRespondToPermission(mockClient), {
				wrapper: createWrapper(),
			});

			await result.current.respondToPermission(
				"session-123",
				"perm-1",
				"reject",
			);

			expect(mockClient.permission.respond).toHaveBeenCalledWith({
				path: { sessionId: "session-123", requestId: "perm-1" },
				body: { reply: "reject" },
			});
		});

		it("handles API errors", async () => {
			(mockClient.permission.respond as jest.Mock).mockRejectedValue(
				new Error("Failed to respond"),
			);

			const { result } = renderHook(() => useRespondToPermission(mockClient), {
				wrapper: createWrapper(),
			});

			await expect(
				result.current.respondToPermission("session-123", "perm-1", "once"),
			).rejects.toThrow("Failed to respond");
		});
	});

	describe("usePermissionQueries", () => {
		it("provides all permission queries and mutations", async () => {
			(mockClient.permission.list as jest.Mock).mockResolvedValue({
				data: [],
			});

			const { result } = renderHook(
				() => usePermissionQueries(mockClient, "session-123"),
				{ wrapper: createWrapper() },
			);

			await waitFor(() => expect(result.current.isLoading).toBe(false));

			expect(result.current.permissions).toBeDefined();
			expect(result.current.respondToPermission).toBeDefined();
		});

		it("throws when no client provided", () => {
			expect(() => {
				renderHook(() => usePermissionQueries(null, "session-123"), {
					wrapper: createWrapper(),
				});
			}).toThrow("No OpenCode client connected");
		});
	});
});

describe("Question Queries", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("usePendingQuestions", () => {
		it("fetches pending questions for session", async () => {
			(mockClient.permission.list as jest.Mock).mockResolvedValue({
				data: [
					{
						id: "q-1",
						sessionID: "session-123",
						type: "question",
						title: "Choose option",
						messageID: "msg-1",
						time: { created: Date.now() },
						metadata: {},
					},
				],
			});

			const { result } = renderHook(
				() => usePendingQuestions(mockClient, "session-123"),
				{ wrapper: createWrapper() },
			);

			await waitFor(() => expect(result.current.isLoading).toBe(false));

			expect(mockClient.permission.list).toHaveBeenCalledWith({
				path: { sessionId: "session-123" },
			});
			expect(result.current.questions).toHaveLength(1);
			expect(result.current.questions[0]?.id).toBe("q-1");
		});

		it("filters questions from permissions list", async () => {
			(mockClient.permission.list as jest.Mock).mockResolvedValue({
				data: [
					{
						id: "perm-1",
						sessionID: "session-123",
						type: "tool",
						title: "Run command",
						messageID: "msg-1",
						time: { created: Date.now() },
						metadata: {},
					},
					{
						id: "q-1",
						sessionID: "session-123",
						type: "question",
						title: "Choose option",
						messageID: "msg-1",
						time: { created: Date.now() },
						metadata: {},
					},
				],
			});

			const { result } = renderHook(
				() => usePendingQuestions(mockClient, "session-123"),
				{ wrapper: createWrapper() },
			);

			await waitFor(() => expect(result.current.isLoading).toBe(false));

			expect(result.current.questions).toHaveLength(1);
			expect(result.current.questions[0]?.type).toBe("question");
		});
	});

	describe("useRespondToQuestion", () => {
		it("responds with answers", async () => {
			(mockClient.permission.respond as jest.Mock).mockResolvedValue({
				data: { success: true },
			});

			const { result } = renderHook(() => useRespondToQuestion(mockClient), {
				wrapper: createWrapper(),
			});

			await result.current.respondToQuestion("session-123", "q-1", [
				["option1"],
				["option2"],
			]);

			expect(mockClient.permission.respond).toHaveBeenCalledWith({
				path: { sessionId: "session-123", requestId: "q-1" },
				body: { answers: [["option1"], ["option2"]] },
			});
		});

		it("handles API errors", async () => {
			(mockClient.permission.respond as jest.Mock).mockRejectedValue(
				new Error("Failed to respond"),
			);

			const { result } = renderHook(() => useRespondToQuestion(mockClient), {
				wrapper: createWrapper(),
			});

			await expect(
				result.current.respondToQuestion("session-123", "q-1", [["option1"]]),
			).rejects.toThrow("Failed to respond");
		});
	});

	describe("useQuestionQueries", () => {
		it("provides all question queries and mutations", () => {
			(mockClient.permission.list as jest.Mock).mockResolvedValue({
				data: [],
			});

			const { result } = renderHook(
				() => useQuestionQueries(mockClient, "session-123"),
				{ wrapper: createWrapper() },
			);

			expect(result.current.questions).toBeDefined();
			expect(result.current.respondToQuestion).toBeDefined();
		});

		it("throws when no client provided", () => {
			expect(() => {
				renderHook(() => useQuestionQueries(null, "session-123"), {
					wrapper: createWrapper(),
				});
			}).toThrow("No OpenCode client connected");
		});
	});
});
