import { render } from "@testing-library/react-native";
import type { TextPart } from "@/domain/types";
import { UserText } from "../UserText";

describe("UserText", () => {
	const createMockPart = (text: string): TextPart => ({
		id: "part-123",
		sessionID: "session-123",
		messageID: "msg-123",
		type: "text",
		text,
	});

	const mockProps = {
		part: createMockPart("This is user text"),
		messageId: "msg-123",
		isMobile: false,
	};

	it("should render user text content", () => {
		const { getByText } = render(<UserText {...mockProps} />);
		expect(getByText("This is user text")).toBeTruthy();
	});

	it("should handle empty text gracefully", () => {
		const { getByTestId } = render(
			<UserText {...mockProps} part={createMockPart("")} />,
		);
		const container = getByTestId("user-text");
		expect(container).toBeTruthy();
	});

	it("should handle multiline text", () => {
		const multilineText = "Line 1\nLine 2\nLine 3";
		const { getByText } = render(
			<UserText {...mockProps} part={createMockPart(multilineText)} />,
		);
		expect(getByText("Line 1")).toBeTruthy();
		expect(getByText("Line 2")).toBeTruthy();
		expect(getByText("Line 3")).toBeTruthy();
	});

	it("should apply user styling", () => {
		const { getByTestId } = render(<UserText {...mockProps} />);
		const container = getByTestId("user-text");
		expect(container.props.className).toContain("user-text");
	});

	it("should apply mobile class when isMobile is true", () => {
		const { getByTestId } = render(<UserText {...mockProps} isMobile={true} />);
		const container = getByTestId("user-text");
		expect(container.props.className).toContain("mobile");
	});

	it("should handle special characters", () => {
		const specialText = "Hello <world> & 'friends' \"quoted\"";
		const { getByText } = render(
			<UserText {...mockProps} part={createMockPart(specialText)} />,
		);
		expect(getByText(/Hello/)).toBeTruthy();
	});

	it("should handle very long text", () => {
		const longText = "a".repeat(10000);
		const { getByText } = render(
			<UserText {...mockProps} part={createMockPart(longText)} />,
		);
		expect(getByText(/^a{100}$/)).toBeTruthy();
	});

	it("should preserve whitespace in pre-formatted text", () => {
		const preformattedText = "  Indented\n    More indented";
		const { getByText } = render(
			<UserText {...mockProps} part={createMockPart(preformattedText)} />,
		);
		expect(getByText(/Indented/)).toBeTruthy();
	});

	it("should handle agent mentions in text", () => {
		const mentionText = "Help @Claude with this task";
		const { getByText } = render(
			<UserText {...mockProps} part={createMockPart(mentionText)} />,
		);
		expect(getByText(/@Claude/)).toBeTruthy();
	});

	it("should not render markdown for user text", () => {
		const markdownText = "**bold** and `code`";
		const { getByText } = render(
			<UserText {...mockProps} part={createMockPart(markdownText)} />,
		);
		expect(getByText(/\*\*bold\*\*/)).toBeTruthy();
	});
});
