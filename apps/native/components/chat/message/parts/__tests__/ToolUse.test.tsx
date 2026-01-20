import { render } from "@testing-library/react-native";
import type { ToolPart } from "@/domain/types";
import { ToolUse } from "../ToolUse";

describe("ToolUse", () => {
	const createToolPart = (
		tool: string,
		status: ToolPart["state"]["status"],
		title?: string,
	): ToolPart => ({
		id: "part-1",
		sessionID: "session-1",
		messageID: "message-1",
		type: "tool",
		callID: "call-1",
		tool,
		state:
			status === "completed"
				? {
						status: "completed",
						input: { query: "test query" },
						output: "Command completed successfully",
						title: title ?? "Test Tool",
						metadata: {},
						time: { start: 1000, end: 2000 },
					}
				: status === "running"
					? {
							status: "running",
							input: { query: "test query" },
							title: "Running Tool",
							time: { start: 1000 },
						}
					: status === "error"
						? {
								status: "error",
								input: { query: "test query" },
								error: "Tool failed",
								time: { start: 1000, end: 1500 },
							}
						: {
								status: "pending",
								input: { query: "test query" },
								raw: "pending",
							},
	});

	it("renders completed tool with title and output", () => {
		const part = createToolPart("bash", "completed", "Run tests");
		const { getByText, getByTestId } = render(
			<ToolUse part={part} messageId="message-1" />,
		);

		expect(getByTestId("tool-use")).toBeTruthy();
		expect(getByText("Run tests")).toBeTruthy();
		expect(getByText("Command completed successfully")).toBeTruthy();
	});

	it("renders running tool with loading indicator", () => {
		const part = createToolPart("bash", "running");
		const { getByText, getByTestId } = render(
			<ToolUse part={part} messageId="message-1" />,
		);

		expect(getByTestId("tool-use")).toBeTruthy();
		expect(getByTestId("tool-loading")).toBeTruthy();
		expect(getByText("Running Tool")).toBeTruthy();
	});

	it("renders error tool with error message", () => {
		const part = createToolPart("bash", "error");
		const { getByText, getByTestId } = render(
			<ToolUse part={part} messageId="message-1" />,
		);

		expect(getByTestId("tool-use")).toBeTruthy();
		expect(getByTestId("tool-error")).toBeTruthy();
		expect(getByText("Tool failed")).toBeTruthy();
	});

	it("renders pending tool without output", () => {
		const part = createToolPart("bash", "pending");
		const { getByTestId, queryByText } = render(
			<ToolUse part={part} messageId="message-1" />,
		);

		expect(getByTestId("tool-use")).toBeTruthy();
		expect(queryByText("Command completed successfully")).toBeNull();
		expect(queryByText("Tool failed")).toBeNull();
	});

	it("displays tool name in badge", () => {
		const part = createToolPart("editor", "completed", "Edit file");
		const { getByText } = render(<ToolUse part={part} messageId="message-1" />);

		expect(getByText("editor")).toBeTruthy();
	});

	it("shows execution time for completed tools", () => {
		const part: ToolPart = {
			id: "part-1",
			sessionID: "session-1",
			messageID: "message-1",
			type: "tool",
			callID: "call-1",
			tool: "bash",
			state: {
				status: "completed",
				input: { query: "test query" },
				output: "Done",
				title: "Quick test",
				metadata: {},
				time: { start: 1000, end: 2500 },
			},
		};
		const { getByText } = render(<ToolUse part={part} messageId="message-1" />);

		expect(getByText(/1\.5s/)).toBeTruthy();
	});

	it("collapses long output by default", () => {
		const part: ToolPart = {
			id: "part-1",
			sessionID: "session-1",
			messageID: "message-1",
			type: "tool",
			callID: "call-1",
			tool: "bash",
			state: {
				status: "completed",
				input: { query: "test query" },
				output: "Line 1\n".repeat(50),
				title: "Long output",
				metadata: {},
				time: { start: 1000, end: 2000 },
			},
		};
		const { getByTestId } = render(
			<ToolUse part={part} messageId="message-1" />,
		);

		expect(getByTestId("tool-use")).toBeTruthy();
	});
});
