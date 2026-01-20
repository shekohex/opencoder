import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import type { ReasoningPart } from "@/domain/types";
import { ReasoningPartComponent } from "../Reasoning";

describe("ReasoningPartComponent", () => {
	const createReasoningPart = (
		text: string,
		start = 1000,
		end?: number,
	): ReasoningPart => ({
		id: "part-1",
		sessionID: "session-1",
		messageID: "message-1",
		type: "reasoning",
		text,
		time: { start, end },
	});

	it("renders reasoning container", () => {
		const part = createReasoningPart("Let me think about this step by step.");
		const { getByTestId, getByText } = render(
			<ReasoningPartComponent part={part} messageId="message-1" />,
		);

		expect(getByTestId("reasoning")).toBeTruthy();
		expect(getByText("Thinking")).toBeTruthy();
	});

	it("shows collapsed by default", () => {
		const part = createReasoningPart("Deep thinking process here");
		const { getByTestId, queryByText } = render(
			<ReasoningPartComponent part={part} messageId="message-1" />,
		);

		expect(getByTestId("reasoning")).toBeTruthy();
		expect(getByTestId("reasoning-collapsed")).toBeTruthy();
		expect(queryByText("Deep thinking process here")).toBeNull();
	});

	it("expands when toggle pressed - controlled mode", () => {
		const part = createReasoningPart("Hidden thoughts");
		const TestWrapper = () => {
			const [expanded, setExpanded] = React.useState(false);
			return (
				<ReasoningPartComponent
					part={part}
					messageId="message-1"
					expanded={expanded}
					onToggle={() => setExpanded(!expanded)}
				/>
			);
		};

		const { getByTestId, getByText, queryByText } = render(<TestWrapper />);

		expect(queryByText("Hidden thoughts")).toBeNull();

		const trigger = getByTestId("reasoning-toggle");
		fireEvent.press(trigger);

		expect(getByText("Hidden thoughts")).toBeTruthy();
	});

	it("shows thinking duration when complete", () => {
		const part = createReasoningPart("Quick thought", 1000, 3000);
		const { getByText } = render(
			<ReasoningPartComponent part={part} messageId="message-1" />,
		);

		expect(getByText(/2s/)).toBeTruthy();
	});

	it("hides duration while in progress", () => {
		const part = createReasoningPart("Still thinking...", 1000, undefined);
		const { queryByText } = render(
			<ReasoningPartComponent part={part} messageId="message-1" />,
		);

		expect(queryByText(/\d+s/)).toBeNull();
	});

	it("displays thinking icon indicator", () => {
		const part = createReasoningPart("Processing...");
		const { getByTestId } = render(
			<ReasoningPartComponent part={part} messageId="message-1" />,
		);

		expect(getByTestId("reasoning-icon")).toBeTruthy();
	});

	it("handles multi-line reasoning text when expanded", () => {
		const part = createReasoningPart(
			"Step 1: Analyze\nStep 2: Plan\nStep 3: Execute",
		);
		const { getByTestId, getByText } = render(
			<ReasoningPartComponent part={part} messageId="message-1" expanded />,
		);

		expect(getByTestId("reasoning")).toBeTruthy();
		expect(getByText(/Step 1: Analyze/)).toBeTruthy();
		expect(getByText(/Step 2: Plan/)).toBeTruthy();
		expect(getByText(/Step 3: Execute/)).toBeTruthy();
	});
});
