import type { OpencodeClient, Pty } from "@opencode-ai/sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import {
	useTerminalConnect,
	useTerminalCreate,
	useTerminalDelete,
	useTerminalList,
	useTerminalResize,
} from "../terminal-queries";

const mockClient = {
	pty: {
		list: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		remove: vi.fn(),
		connect: vi.fn(),
	},
} as unknown as OpencodeClient;

const queryClient = new QueryClient({
	defaultOptions: {
		queries: { retry: false },
		mutations: { retry: false },
	},
});

const wrapper = ({ children }) => {
	return React.createElement(
		QueryClientProvider,
		{ client: queryClient },
		children,
	);
};

describe("terminal-queries", () => {
	const workspaceId = "workspace-123";

	describe("useTerminalList", () => {
		it("returns empty array initially", () => {
			const { result } = renderHook(
				() => useTerminalList(null, workspaceId, "/workspace"),
				{ wrapper },
			);

			expect(result.current.terminals).toEqual([]);
		});

		it("is disabled when client is null", () => {
			const { result } = renderHook(
				() => useTerminalList(null, workspaceId, "/workspace"),
				{ wrapper },
			);

			expect(result.current.isLoading).toBe(false);
		});

		it("fetches terminal list when client is available", async () => {
			const mockTerminals: Pty[] = [
				{
					id: "pty-1",
					title: "Terminal 1",
					command: "bash",
					args: [],
					cwd: "/workspace",
					status: "running",
					pid: 1234,
				},
			];

			vi.mocked(mockClient.pty.list).mockResolvedValue({ data: mockTerminals });

			const { result } = renderHook(
				() => useTerminalList(mockClient, workspaceId, "/workspace"),
				{ wrapper },
			);

			await waitFor(() => expect(result.current.isLoading).toBe(false));

			expect(mockClient.pty.list).toHaveBeenCalledWith({
				query: { directory: "/workspace" },
			});
			expect(result.current.terminals).toEqual(mockTerminals);
		});

		it("handles fetch errors", async () => {
			vi.mocked(mockClient.pty.list).mockRejectedValue(
				new Error("Failed to fetch terminals"),
			);

			const { result } = renderHook(
				() => useTerminalList(mockClient, workspaceId, "/workspace"),
				{ wrapper },
			);

			await waitFor(() => expect(result.current.isError).toBe(true));

			expect(result.current.error).toBeTruthy();
		});
	});

	describe("useTerminalCreate", () => {
		it("creates a new terminal", async () => {
			const mockPty: Pty = {
				id: "pty-new",
				title: "New Terminal",
				command: "bash",
				args: [],
				cwd: "/workspace",
				status: "running",
				pid: 5678,
			};

			vi.mocked(mockClient.pty.create).mockResolvedValue({ data: mockPty });

			const { result } = renderHook(() => useTerminalCreate(mockClient), {
				wrapper,
			});

			await result.current.mutateAsync({
				cwd: "/workspace",
				command: "bash",
				args: [],
			});

			expect(mockClient.pty.create).toHaveBeenCalledWith({
				body: {
					command: "bash",
					args: [],
					cwd: "/workspace",
				},
			});
			expect(result.current.data).toEqual(mockPty);
		});

		it("throws error when client is null", async () => {
			const { result } = renderHook(() => useTerminalCreate(null), {
				wrapper,
			});

			await expect(
				result.current.mutateAsync({
					cwd: "/workspace",
					command: "bash",
					args: [],
				}),
			).rejects.toThrow("OpenCode client not available");
		});
	});

	describe("useTerminalResize", () => {
		it("resizes terminal", async () => {
			const mockPty: Pty = {
				id: "pty-1",
				title: "Terminal 1",
				command: "bash",
				args: [],
				cwd: "/workspace",
				status: "running",
				pid: 1234,
			};

			vi.mocked(mockClient.pty.update).mockResolvedValue({ data: mockPty });

			const { result } = renderHook(() => useTerminalResize(mockClient), {
				wrapper,
			});

			await result.current.mutateAsync({
				ptyId: "pty-1",
				rows: 24,
				cols: 80,
			});

			expect(mockClient.pty.update).toHaveBeenCalledWith({
				body: { size: { rows: 24, cols: 80 } },
				path: { id: "pty-1" },
			});
		});

		it("throws error when client is null", async () => {
			const { result } = renderHook(() => useTerminalResize(null), {
				wrapper,
			});

			await expect(
				result.current.mutateAsync({
					ptyId: "pty-1",
					rows: 24,
					cols: 80,
				}),
			).rejects.toThrow("OpenCode client not available");
		});
	});

	describe("useTerminalDelete", () => {
		it("deletes terminal", async () => {
			vi.mocked(mockClient.pty.remove).mockResolvedValue(undefined);

			const { result } = renderHook(() => useTerminalDelete(mockClient), {
				wrapper,
			});

			await result.current.mutateAsync({ ptyId: "pty-1" });

			expect(mockClient.pty.remove).toHaveBeenCalledWith({
				path: { id: "pty-1" },
			});
		});

		it("throws error when client is null", async () => {
			const { result } = renderHook(() => useTerminalDelete(null), {
				wrapper,
			});

			await expect(
				result.current.mutateAsync({ ptyId: "pty-1" }),
			).rejects.toThrow("OpenCode client not available");
		});
	});

	describe("useTerminalConnect", () => {
		it("connects to terminal", async () => {
			vi.mocked(mockClient.pty.connect).mockResolvedValue({ data: true });

			const { result } = renderHook(() => useTerminalConnect(mockClient), {
				wrapper,
			});

			await result.current.mutateAsync({ ptyId: "pty-1" });

			expect(mockClient.pty.connect).toHaveBeenCalledWith({
				path: { id: "pty-1" },
			});
		});

		it("throws error when client is null", async () => {
			const { result } = renderHook(() => useTerminalConnect(null), {
				wrapper,
			});

			await expect(
				result.current.mutateAsync({ ptyId: "pty-1" }),
			).rejects.toThrow("OpenCode client not available");
		});
	});
});
