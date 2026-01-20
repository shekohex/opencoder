import { render } from "@testing-library/react-native";
import React from "react";
import { FontProvider } from "@/lib/font-context";
import { MessageHeader } from "../MessageHeader";

const wrapper = ({ children }) =>
	React.createElement(FontProvider, null, children);

describe("MessageHeader", () => {
	describe("user role", () => {
		it("renders 'You' for user role", () => {
			const { getByText } = render(
				<MessageHeader
					messageId="msg-1"
					status="completed"
					timestamp={1704067200000}
				/>,
				{ wrapper },
			);
			expect(getByText("You")).toBeTruthy();
		});

		it("displays formatted timestamp", () => {
			const { getByText } = render(
				<MessageHeader
					messageId="msg-1"
					status="completed"
					timestamp={1704067200000}
				/>,
				{ wrapper },
			);
			expect(getByText("00:00")).toBeTruthy();
		});
	});

	describe("assistant role", () => {
		it("renders agentName when provided", () => {
			const { getByText } = render(
				<MessageHeader
					messageId="msg-1"
					agentName="Claude"
					modelName="Opus"
					status="completed"
					timestamp={1704067200000}
				/>,
				{ wrapper },
			);
			expect(getByText("Claude")).toBeTruthy();
		});

		it("renders modelName", () => {
			const { getByText } = render(
				<MessageHeader
					messageId="msg-1"
					modelName="Opus"
					status="completed"
					timestamp={1704067200000}
				/>,
				{ wrapper },
			);
			expect(getByText("Opus")).toBeTruthy();
		});

		it("renders both agentName and modelName", () => {
			const { getByText } = render(
				<MessageHeader
					messageId="msg-1"
					agentName="Claude"
					modelName="Opus"
					status="completed"
					timestamp={1704067200000}
				/>,
				{ wrapper },
			);
			expect(getByText("Claude")).toBeTruthy();
			expect(getByText("Opus")).toBeTruthy();
		});
	});

	describe("status indicator", () => {
		it("shows ActivityIndicator for pending status", () => {
			const { getByTestId } = render(
				<MessageHeader
					messageId="msg-1"
					status="pending"
					timestamp={1704067200000}
				/>,
				{ wrapper },
			);
			expect(getByTestId("status-indicator")).toBeTruthy();
		});

		it("does not show indicator for completed status", () => {
			const { queryByTestId } = render(
				<MessageHeader
					messageId="msg-1"
					status="completed"
					timestamp={1704067200000}
				/>,
				{ wrapper },
			);
			expect(queryByTestId("status-indicator")).toBeNull();
		});

		it("does not show indicator for error status", () => {
			const { queryByTestId } = render(
				<MessageHeader
					messageId="msg-1"
					status="error"
					timestamp={1704067200000}
				/>,
				{ wrapper },
			);
			expect(queryByTestId("status-indicator")).toBeNull();
		});
	});

	describe("timestamp formatting", () => {
		it("formats 24-hour time correctly", () => {
			const { getByText } = render(
				<MessageHeader
					messageId="msg-1"
					status="completed"
					timestamp={1704070800000}
				/>,
				{ wrapper },
			);
			expect(getByText("01:00")).toBeTruthy();
		});

		it("formats afternoon times correctly", () => {
			const { getByText } = render(
				<MessageHeader
					messageId="msg-1"
					status="completed"
					timestamp={1704103200000}
				/>,
				{ wrapper },
			);
			expect(getByText("10:00")).toBeTruthy();
		});
	});
});
