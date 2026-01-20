import type { Permission } from "@opencode-ai/sdk";
import { render } from "@testing-library/react-native";

import { PermissionRequest } from "../PermissionRequest";

jest.mock("@/lib/opencode-provider", () => ({
	useWorkspaceSDK: () => ({
		client: {
			permission: {
				list: jest.fn(),
				respond: jest.fn(),
			},
		},
	}),
	WorkspaceSDKProvider: ({ children }: { children: unknown }) =>
		children as React.ReactNode,
}));

describe("PermissionRequest", () => {
	const mockPermissions: Permission[] = [
		{
			id: "perm-1",
			type: "tool",
			sessionID: "session-1",
			messageID: "msg-1",
			title: "Execute command",
			metadata: {
				command: "npm install",
				cwd: "/workspace",
			},
			time: { created: Date.now() },
		},
	];

	const mockQuestions: Permission[] = [
		{
			id: "question-1",
			type: "question",
			sessionID: "session-1",
			messageID: "msg-1",
			title: "Choose approach",
			metadata: {
				header: "Approach",
				multiple: false,
				options: [
					{ label: "Option A", description: "First option" },
					{ label: "Option B", description: "Second option" },
				],
			},
			time: { created: Date.now() },
		},
	];

	it("renders nothing when no permissions or questions", () => {
		jest
			.spyOn(require("@/lib/chat/permission-queries"), "usePendingPermissions")
			.mockReturnValue({
				permissions: [],
				isLoading: false,
				isError: false,
				error: null,
			});
		jest
			.spyOn(require("@/lib/chat/permission-queries"), "usePendingQuestions")
			.mockReturnValue({
				questions: [],
				isLoading: false,
				isError: false,
				error: null,
			});

		const { toJSON } = render(<PermissionRequest sessionId="session-1" />);
		expect(toJSON()).toBeNull();
	});

	it("renders permission cards", () => {
		jest
			.spyOn(require("@/lib/chat/permission-queries"), "usePendingPermissions")
			.mockReturnValue({
				permissions: mockPermissions,
				isLoading: false,
				isError: false,
				error: null,
			});
		jest
			.spyOn(require("@/lib/chat/permission-queries"), "usePendingQuestions")
			.mockReturnValue({
				questions: [],
				isLoading: false,
				isError: false,
				error: null,
			});

		const { getByText } = render(<PermissionRequest sessionId="session-1" />);
		expect(getByText("Permission Required")).toBeTruthy();
		expect(getByText("Execute command")).toBeTruthy();
	});

	it("renders question cards", () => {
		jest
			.spyOn(require("@/lib/chat/permission-queries"), "usePendingPermissions")
			.mockReturnValue({
				permissions: [],
				isLoading: false,
				isError: false,
				error: null,
			});
		jest
			.spyOn(require("@/lib/chat/permission-queries"), "usePendingQuestions")
			.mockReturnValue({
				questions: mockQuestions,
				isLoading: false,
				isError: false,
				error: null,
			});

		const { getByText } = render(<PermissionRequest sessionId="session-1" />);
		expect(getByText("Input Needed")).toBeTruthy();
		expect(getByText("Choose approach")).toBeTruthy();
	});
});
