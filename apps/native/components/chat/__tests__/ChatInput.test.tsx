import { render } from "@testing-library/react-native";
import React from "react";
import { FontProvider } from "@/lib/font-context";
import { ChatInput } from "../ChatInput";

const wrapper = ({ children }) => {
	return React.createElement(
		global.TestQueryClientProvider,
		null,
		React.createElement(FontProvider, null, children),
	);
};

const workspaceId = "workspace-123";
const sessionId = "session-abc";

describe("ChatInput", () => {
	it("renders text input", () => {
		const { getByTestId } = render(
			<ChatInput workspaceId={workspaceId} sessionId={sessionId} />,
			{ wrapper },
		);

		expect(getByTestId("chat-input")).toBeTruthy();
	});

	it("renders send button", () => {
		const { getByTestId } = render(
			<ChatInput workspaceId={workspaceId} sessionId={sessionId} />,
			{ wrapper },
		);

		expect(getByTestId("send-button")).toBeTruthy();
	});

	it("send button is disabled when input is empty", () => {
		const { getByTestId } = render(
			<ChatInput workspaceId={workspaceId} sessionId={sessionId} />,
			{ wrapper },
		);

		expect(getByTestId("send-button").props.disabled).toBe(true);
	});

	it("has placeholder text", () => {
		const { getByTestId } = render(
			<ChatInput workspaceId={workspaceId} sessionId={sessionId} />,
			{ wrapper },
		);

		expect(getByTestId("chat-input").props.placeholder).toBe(
			"Message OpenCode...",
		);
	});

	it("supports multiline input", () => {
		const { getByTestId } = render(
			<ChatInput workspaceId={workspaceId} sessionId={sessionId} />,
			{ wrapper },
		);

		expect(getByTestId("chat-input").props.multiline).toBe(true);
	});

	it("is disabled when disabled prop is true", () => {
		const { getByTestId } = render(
			<ChatInput workspaceId={workspaceId} sessionId={sessionId} disabled />,
			{ wrapper },
		);

		expect(getByTestId("chat-input").props.editable).toBe(false);
	});

	it("calls onSendMessage when send button is pressed", () => {
		const onSendMessage = jest.fn();
		const { getByTestId } = render(
			<ChatInput
				workspaceId={workspaceId}
				sessionId={sessionId}
				onSendMessage={onSendMessage}
			/>,
			{ wrapper },
		);

		const input = getByTestId("chat-input");
		input.props.onChangeText("test message");

		const sendButton = getByTestId("send-button");
		sendButton.props.onPress();

		expect(onSendMessage).toHaveBeenCalledWith("test message");
	});

	it("calls onSendMessage on submit editing", () => {
		const onSendMessage = jest.fn();
		const { getByTestId } = render(
			<ChatInput
				workspaceId={workspaceId}
				sessionId={sessionId}
				onSendMessage={onSendMessage}
			/>,
			{ wrapper },
		);

		const input = getByTestId("chat-input");
		input.props.onChangeText("hello");
		input.props.onSubmitEditing();

		expect(onSendMessage).toHaveBeenCalledWith("hello");
	});
});
