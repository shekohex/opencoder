import { describe, expect, it, jest } from "@jest/globals";
import {
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react-native";
import type { PermissionType } from "@/domain/types";
import { PermissionCard } from "../PermissionCard";

describe("PermissionCard", () => {
	const mockPermission = {
		id: "perm-1",
		sessionID: "session-123",
		type: "tool" as PermissionType,
		title: "Run bash command",
		messageID: "msg-1",
		callID: "call-1",
		pattern: "*.txt",
		time: { created: Date.now() },
		metadata: {
			command: "ls -la",
			cwd: "/home/user",
		},
	};

	const mockOnResponse = jest.fn();

	it("renders permission request", () => {
		render(
			<PermissionCard
				permission={mockPermission}
				onResponse={mockOnResponse}
			/>,
		);

		expect(screen.getByText(/permission required/i)).toBeTruthy();
		expect(screen.getByText(/bash/i)).toBeTruthy();
	});

	it("displays command for bash tool", () => {
		render(
			<PermissionCard
				permission={mockPermission}
				onResponse={mockOnResponse}
			/>,
		);

		expect(screen.getByText(/ls -la/i)).toBeTruthy();
	});

	it("displays working directory", () => {
		render(
			<PermissionCard
				permission={mockPermission}
				onResponse={mockOnResponse}
			/>,
		);

		expect(screen.getByText(/\/home\/user/i)).toBeTruthy();
	});

	it("renders allow once button", () => {
		render(
			<PermissionCard
				permission={mockPermission}
				onResponse={mockOnResponse}
			/>,
		);

		const button = screen.getByText(/allow once/i);
		expect(button).toBeTruthy();
	});

	it("renders always allow button", () => {
		render(
			<PermissionCard
				permission={mockPermission}
				onResponse={mockOnResponse}
			/>,
		);

		const button = screen.getByText(/always allow/i);
		expect(button).toBeTruthy();
	});

	it("renders deny button", () => {
		render(
			<PermissionCard
				permission={mockPermission}
				onResponse={mockOnResponse}
			/>,
		);

		const button = screen.getByText(/deny/i);
		expect(button).toBeTruthy();
	});

	it("calls onResponse with once when allow once pressed", async () => {
		render(
			<PermissionCard
				permission={mockPermission}
				onResponse={mockOnResponse}
			/>,
		);

		const button = screen.getByText(/allow once/i);
		fireEvent.press(button);

		await waitFor(() => {
			expect(mockOnResponse).toHaveBeenCalledWith("once");
		});
	});

	it("calls onResponse with always when always allow pressed", async () => {
		render(
			<PermissionCard
				permission={mockPermission}
				onResponse={mockOnResponse}
			/>,
		);

		const button = screen.getByText(/always allow/i);
		fireEvent.press(button);

		await waitFor(() => {
			expect(mockOnResponse).toHaveBeenCalledWith("always");
		});
	});

	it("calls onResponse with reject when deny pressed", async () => {
		render(
			<PermissionCard
				permission={mockPermission}
				onResponse={mockOnResponse}
			/>,
		);

		const button = screen.getByText(/deny/i);
		fireEvent.press(button);

		await waitFor(() => {
			expect(mockOnResponse).toHaveBeenCalledWith("reject");
		});
	});

	it("disables buttons while responding", async () => {
		let resolvingPromise: (value: undefined) => void;
		const slowOnResponse = jest.fn(
			() =>
				new Promise<void>((resolve) => {
					resolvingPromise = resolve;
				}),
		);

		render(
			<PermissionCard
				permission={mockPermission}
				onResponse={slowOnResponse}
			/>,
		);

		const button = screen.getByTestId("allow-once-button");
		fireEvent.press(button);

		await waitFor(() => {
			expect(button.props.disabled).toBe(true);
		});

		resolvingPromise?.();
	});

	it("hides after response", async () => {
		let resolvingPromise: (value: undefined) => void;
		const onResponse = jest.fn(
			() =>
				new Promise<void>((resolve) => {
					resolvingPromise = resolve;
				}),
		);

		const { getByText, queryByText } = render(
			<PermissionCard permission={mockPermission} onResponse={onResponse} />,
		);

		const button = getByText(/allow once/i);
		fireEvent.press(button);

		await waitFor(() => {
			expect(onResponse).toHaveBeenCalled();
		});

		resolvingPromise?.();

		await waitFor(() => {
			expect(queryByText(/permission required/i)).toBeNull();
		});
	});

	it("displays file path for edit tool", () => {
		const editPermission = {
			...mockPermission,
			title: "Edit file",
			metadata: {
				path: "/home/user/test.txt",
				changes: "--- a/test.txt\n+++ b/test.txt\n@@ -1 +1 @@-old\n+new",
			},
		};

		render(
			<PermissionCard
				permission={editPermission}
				onResponse={mockOnResponse}
			/>,
		);

		expect(screen.getByText(/\/home\/user\/test\.txt/i)).toBeTruthy();
	});

	it("displays url for webfetch tool", () => {
		const webfetchPermission = {
			...mockPermission,
			title: "Fetch URL",
			metadata: {
				url: "https://example.com/api",
				method: "GET",
			},
		};

		render(
			<PermissionCard
				permission={webfetchPermission}
				onResponse={mockOnResponse}
			/>,
		);

		expect(screen.getByText(/https:\/\/example\.com\/api/i)).toBeTruthy();
	});

	it("displays content for write tool", () => {
		const writePermission = {
			...mockPermission,
			title: "Write file",
			metadata: {
				path: "/home/user/newfile.txt",
				content: "Hello, world!",
			},
		};

		render(
			<PermissionCard
				permission={writePermission}
				onResponse={mockOnResponse}
			/>,
		);

		expect(screen.getByText(/hello, world!/i)).toBeTruthy();
	});

	it("displays patterns when provided", () => {
		const patternPermission = {
			...mockPermission,
			pattern: ["*.txt", "*.md"],
		};

		render(
			<PermissionCard
				permission={patternPermission}
				onResponse={mockOnResponse}
			/>,
		);

		expect(screen.getByText(/\*\.txt, \*\.md/i)).toBeTruthy();
	});
});
