import { render } from "@testing-library/react-native";
import type { Message, Part } from "@/domain/types";
import { MessageBody } from "../MessageBody";

describe("MessageBody", () => {
	const createMessage = (role: Message["role"]): Message => ({
		id: "msg-1",
		role,
		createdAt: 1704067200000,
		updatedAt: 1704067200000,
	});

	const createTextPart = (id: string, text: string): Part => ({
		id,
		type: "text",
		text,
	});

	describe("user messages", () => {
		it("renders UserText component for user role", () => {
			const message = createMessage("user");
			const parts: Part[] = [createTextPart("part-1", "Hello world")];

			const { getByTestId } = render(
				<MessageBody message={message} parts={parts} />,
			);

			expect(getByTestId("message-body")).toBeTruthy();
			expect(getByTestId("user-text")).toBeTruthy();
		});

		it("applies user-message className", () => {
			const message = createMessage("user");
			const parts: Part[] = [createTextPart("part-1", "Test")];

			const { getByTestId } = render(
				<MessageBody message={message} parts={parts} />,
			);

			const body = getByTestId("message-body");
			expect(body.props.className).toContain("user-message");
		});
	});

	describe("assistant messages", () => {
		it("renders AssistantText component for assistant role", () => {
			const message = createMessage("assistant");
			const parts: Part[] = [createTextPart("part-1", "Hello there")];

			const { getByTestId } = render(
				<MessageBody message={message} parts={parts} />,
			);

			expect(getByTestId("message-body")).toBeTruthy();
			expect(getByTestId("assistant-text")).toBeTruthy();
		});

		it("applies assistant-message className", () => {
			const message = createMessage("assistant");
			const parts: Part[] = [createTextPart("part-1", "Test")];

			const { getByTestId } = render(
				<MessageBody message={message} parts={parts} />,
			);

			const body = getByTestId("message-body");
			expect(body.props.className).toContain("assistant-message");
		});
	});

	describe("empty text filtering", () => {
		it("filters out empty text parts", () => {
			const message = createMessage("assistant");
			const parts: Part[] = [
				createTextPart("part-1", ""),
				createTextPart("part-2", "   "),
				createTextPart("part-3", "Valid text"),
			];

			const { queryAllByTestId } = render(
				<MessageBody message={message} parts={parts} />,
			);

			const textComponents = queryAllByTestId("assistant-text");
			expect(textComponents).toHaveLength(1);
		});

		it("filters out null/undefined text", () => {
			const message = createMessage("assistant");
			const parts: Part[] = [
				{ id: "part-1", type: "text", text: null as any },
				{ id: "part-2", type: "text", text: undefined as any },
				createTextPart("part-3", "Valid"),
			];

			const { queryAllByTestId } = render(
				<MessageBody message={message} parts={parts} />,
			);

			const textComponents = queryAllByTestId("assistant-text");
			expect(textComponents).toHaveLength(1);
		});

		it("renders all non-empty parts", () => {
			const message = createMessage("assistant");
			const parts: Part[] = [
				createTextPart("part-1", "First"),
				createTextPart("part-2", "Second"),
				createTextPart("part-3", "Third"),
			];

			const { queryAllByTestId } = render(
				<MessageBody message={message} parts={parts} />,
			);

			const textComponents = queryAllByTestId("assistant-text");
			expect(textComponents).toHaveLength(3);
		});
	});

	describe("mobile prop", () => {
		it("adds mobile className when isMobile is true", () => {
			const message = createMessage("user");
			const parts: Part[] = [createTextPart("part-1", "Test")];

			const { getByTestId } = render(
				<MessageBody message={message} parts={parts} isMobile={true} />,
			);

			const body = getByTestId("message-body");
			expect(body.props.className).toContain("mobile");
		});

		it("does not add mobile className when isMobile is false", () => {
			const message = createMessage("user");
			const parts: Part[] = [createTextPart("part-1", "Test")];

			const { getByTestId } = render(
				<MessageBody message={message} parts={parts} isMobile={false} />,
			);

			const body = getByTestId("message-body");
			expect(body.props.className).not.toContain("mobile");
		});

		it("defaults isMobile to false", () => {
			const message = createMessage("user");
			const parts: Part[] = [createTextPart("part-1", "Test")];

			const { getByTestId } = render(
				<MessageBody message={message} parts={parts} />,
			);

			const body = getByTestId("message-body");
			expect(body.props.className).not.toContain("mobile");
		});
	});

	describe("non-text parts", () => {
		it("ignores non-text parts", () => {
			const message = createMessage("assistant");
			const parts: Part[] = [
				createTextPart("part-1", "Text content"),
				{
					id: "part-2",
					type: "image",
					url: "http://example.com/img.png",
				} as Part,
			];

			const { getByTestId, queryByTestId } = render(
				<MessageBody message={message} parts={parts} />,
			);

			expect(getByTestId("assistant-text")).toBeTruthy();
			expect(queryByTestId("part-2")).toBeNull();
		});

		it("returns null for unsupported part types", () => {
			const message = createMessage("assistant");
			const parts: Part[] = [
				{
					id: "part-1",
					type: "image",
					url: "http://example.com/img.png",
				} as Part,
			];

			const { getByTestId } = render(
				<MessageBody message={message} parts={parts} />,
			);

			const body = getByTestId("message-body");
			expect(body.children).toHaveLength(0);
		});
	});

	describe("multiple parts", () => {
		it("renders multiple text parts in order", () => {
			const message = createMessage("assistant");
			const parts: Part[] = [
				createTextPart("part-1", "First"),
				createTextPart("part-2", "Second"),
				createTextPart("part-3", "Third"),
			];

			const { queryAllByTestId, getByText } = render(
				<MessageBody message={message} parts={parts} />,
			);

			const textComponents = queryAllByTestId("assistant-text");
			expect(textComponents).toHaveLength(3);
			expect(getByText("First")).toBeTruthy();
			expect(getByText("Second")).toBeTruthy();
			expect(getByText("Third")).toBeTruthy();
		});
	});
});
