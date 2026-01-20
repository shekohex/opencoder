import { render } from "@testing-library/react-native";
import type { TextPart } from "@/domain/types";
import { AssistantText } from "../AssistantText";

describe("AssistantText", () => {
	const createMockPart = (text: string): TextPart => ({
		id: "part-123",
		sessionID: "session-123",
		messageID: "msg-123",
		type: "text",
		text,
		time: { start: Date.now(), end: Date.now() + 1000 },
	});

	const mockProps = {
		part: createMockPart("This is assistant text"),
		messageId: "msg-123",
		isMobile: false,
	};

	it("should render assistant text content", () => {
		const { getByText } = render(<AssistantText {...mockProps} />);
		expect(getByText("This is assistant text")).toBeTruthy();
	});

	it("should handle empty text gracefully", () => {
		const { getByTestId } = render(
			<AssistantText {...mockProps} part={createMockPart("")} />,
		);
		const container = getByTestId("assistant-text");
		expect(container).toBeTruthy();
	});

	it("should handle multiline text", () => {
		const multilineText = "Line 1\nLine 2\nLine 3";
		const { getByText } = render(
			<AssistantText {...mockProps} part={createMockPart(multilineText)} />,
		);
		expect(getByText("Line 1")).toBeTruthy();
		expect(getByText("Line 2")).toBeTruthy();
		expect(getByText("Line 3")).toBeTruthy();
	});

	it("should apply streaming class when streaming is true", () => {
		const { getByTestId } = render(
			<AssistantText {...mockProps} isStreaming={true} />,
		);
		const container = getByTestId("assistant-text");
		expect(container.props.className).toContain("streaming");
	});

	it("should not apply streaming class when streaming is false", () => {
		const { getByTestId } = render(
			<AssistantText {...mockProps} isStreaming={false} />,
		);
		const container = getByTestId("assistant-text");
		expect(container.props.className).not.toContain("streaming");
	});

	it("should apply mobile class when isMobile is true", () => {
		const { getByTestId } = render(
			<AssistantText {...mockProps} isMobile={true} />,
		);
		const container = getByTestId("assistant-text");
		expect(container.props.className).toContain("mobile");
	});

	it("should handle code blocks in markdown", () => {
		const codeText = "```javascript\nconst x = 1;\n```";
		const { getByText } = render(
			<AssistantText {...mockProps} part={createMockPart(codeText)} />,
		);
		expect(getByText(/javascript/i)).toBeTruthy();
	});

	it("should handle inline code in markdown", () => {
		const inlineCodeText = "Use `const` for declarations";
		const { getByText } = render(
			<AssistantText {...mockProps} part={createMockPart(inlineCodeText)} />,
		);
		expect(getByText(/const/)).toBeTruthy();
	});

	it("should show cursor when streaming and not complete", () => {
		const { getByTestId } = render(
			<AssistantText {...mockProps} isStreaming={true} isComplete={false} />,
		);
		const cursor = getByTestId("streaming-cursor");
		expect(cursor).toBeTruthy();
	});

	it("should not show cursor when complete", () => {
		const { queryByTestId } = render(
			<AssistantText {...mockProps} isStreaming={false} isComplete={true} />,
		);
		const cursor = queryByTestId("streaming-cursor");
		expect(cursor).toBeNull();
	});
});
