import { describe, expect, it, jest } from "@jest/globals";
import {
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react-native";

import { QuestionCard } from "../QuestionCard";

describe("QuestionCard", () => {
	const mockQuestion = {
		id: "q-1",
		sessionID: "session-123",
		type: "question",
		title: "Choose option",
		messageID: "msg-1",
		time: { created: Date.now() },
		metadata: {},
	};

	const mockRespond = jest.fn();
	const mockReject = jest.fn();

	it("renders question request", () => {
		render(
			<QuestionCard
				question={mockQuestion}
				questions={[
					{
						question: "What is your preferred language?",
						header: "Language",
						options: [
							{ label: "TypeScript", description: "Static typing" },
							{ label: "JavaScript", description: "Dynamic typing" },
						],
					},
				]}
				onRespond={mockRespond}
				onReject={mockReject}
			/>,
		);

		expect(screen.getByText(/input needed/i)).toBeTruthy();
		expect(screen.getByText(/what is your preferred language/i)).toBeTruthy();
	});

	it("displays question options", () => {
		render(
			<QuestionCard
				question={mockQuestion}
				questions={[
					{
						question: "Choose one",
						header: "Options",
						options: [
							{ label: "Option A", description: "First option" },
							{ label: "Option B", description: "Second option" },
						],
					},
				]}
				onRespond={mockRespond}
				onReject={mockReject}
			/>,
		);

		expect(screen.getByText(/option a/i)).toBeTruthy();
		expect(screen.getByText(/option b/i)).toBeTruthy();
	});

	it("selects single option", async () => {
		render(
			<QuestionCard
				question={mockQuestion}
				questions={[
					{
						question: "Choose one",
						header: "Options",
						options: [
							{ label: "Option A", description: "First option" },
							{ label: "Option B", description: "Second option" },
						],
					},
				]}
				onRespond={mockRespond}
				onReject={mockReject}
			/>,
		);

		const option = screen.getByText(/option a/i);
		fireEvent.press(option);

		await waitFor(() => {
			expect(option).toBeTruthy();
		});
	});

	it("selects multiple options when multiple is true", async () => {
		render(
			<QuestionCard
				question={mockQuestion}
				questions={[
					{
						question: "Choose multiple",
						header: "Options",
						multiple: true,
						options: [
							{ label: "Option A", description: "First option" },
							{ label: "Option B", description: "Second option" },
							{ label: "Option C", description: "Third option" },
						],
					},
				]}
				onRespond={mockRespond}
				onReject={mockReject}
			/>,
		);

		const optionA = screen.getByText(/option a/i);
		const optionB = screen.getByText(/option b/i);

		fireEvent.press(optionA);
		fireEvent.press(optionB);

		await waitFor(() => {
			expect(optionA).toBeTruthy();
			expect(optionB).toBeTruthy();
		});
	});

	it("displays select multiple hint when multiple is true", () => {
		render(
			<QuestionCard
				question={mockQuestion}
				questions={[
					{
						question: "Choose",
						header: "Options",
						multiple: true,
						options: [{ label: "Option A", description: "First" }],
					},
				]}
				onRespond={mockRespond}
				onReject={mockReject}
			/>,
		);

		expect(screen.getByText(/select multiple/i)).toBeTruthy();
	});

	it("renders confirm button", () => {
		render(
			<QuestionCard
				question={mockQuestion}
				questions={[
					{
						question: "Choose",
						header: "Options",
						options: [{ label: "Option A", description: "First" }],
					},
				]}
				onRespond={mockRespond}
				onReject={mockReject}
			/>,
		);

		expect(screen.getByText(/confirm/i)).toBeTruthy();
	});

	it("renders dismiss button", () => {
		render(
			<QuestionCard
				question={mockQuestion}
				questions={[
					{
						question: "Choose",
						header: "Options",
						options: [{ label: "Option A", description: "First" }],
					},
				]}
				onRespond={mockRespond}
				onReject={mockReject}
			/>,
		);

		expect(screen.getByText(/dismiss/i)).toBeTruthy();
	});

	it("calls onRespond with selected answers", async () => {
		render(
			<QuestionCard
				question={mockQuestion}
				questions={[
					{
						question: "Choose",
						header: "Options",
						options: [
							{ label: "Option A", description: "First" },
							{ label: "Option B", description: "Second" },
						],
					},
				]}
				onRespond={mockRespond}
				onReject={mockReject}
			/>,
		);

		const option = screen.getByText(/option a/i);
		fireEvent.press(option);

		const confirm = screen.getByText(/confirm/i);
		fireEvent.press(confirm);

		await waitFor(() => {
			expect(mockRespond).toHaveBeenCalledWith([["Option A"]]);
		});
	});

	it("calls onReject when dismiss pressed", async () => {
		render(
			<QuestionCard
				question={mockQuestion}
				questions={[
					{
						question: "Choose",
						header: "Options",
						options: [{ label: "Option A", description: "First" }],
					},
				]}
				onRespond={mockRespond}
				onReject={mockReject}
			/>,
		);

		const dismiss = screen.getByText(/dismiss/i);
		fireEvent.press(dismiss);

		await waitFor(() => {
			expect(mockReject).toHaveBeenCalled();
		});
	});

	it("disables confirm when no option selected", () => {
		render(
			<QuestionCard
				question={mockQuestion}
				questions={[
					{
						question: "Choose",
						header: "Options",
						options: [{ label: "Option A", description: "First" }],
					},
				]}
				onRespond={mockRespond}
				onReject={mockReject}
			/>,
		);

		const confirm = screen.getByTestId("confirm-button");
		expect(confirm.props.disabled).toBe(true);
	});

	it("enables confirm when option selected", async () => {
		render(
			<QuestionCard
				question={mockQuestion}
				questions={[
					{
						question: "Choose",
						header: "Options",
						options: [{ label: "Option A", description: "First" }],
					},
				]}
				onRespond={mockRespond}
				onReject={mockReject}
			/>,
		);

		const option = screen.getByText(/option a/i);
		fireEvent.press(option);

		await waitFor(() => {
			const confirm = screen.getByTestId("confirm-button");
			expect(confirm.props.disabled).toBe(false);
		});
	});

	it("displays tabs for multiple questions", () => {
		render(
			<QuestionCard
				question={mockQuestion}
				questions={[
					{
						question: "Q1",
						header: "First",
						options: [{ label: "A", description: "" }],
					},
					{
						question: "Q2",
						header: "Second",
						options: [{ label: "B", description: "" }],
					},
				]}
				onRespond={mockRespond}
				onReject={mockReject}
			/>,
		);

		expect(screen.getByText(/first/i)).toBeTruthy();
		expect(screen.getByText(/second/i)).toBeTruthy();
		expect(screen.getByText(/summary/i)).toBeTruthy();
	});

	it("shows summary tab with answer previews", async () => {
		render(
			<QuestionCard
				question={mockQuestion}
				questions={[
					{
						question: "Q1",
						header: "First",
						options: [{ label: "A", description: "" }],
					},
					{
						question: "Q2",
						header: "Second",
						options: [{ label: "B", description: "" }],
					},
				]}
				onRespond={mockRespond}
				onReject={mockReject}
			/>,
		);

		const summaryTab = screen.getByText(/summary/i);
		fireEvent.press(summaryTab);

		await waitFor(() => {
			expect(screen.getAllByText(/\(no answer\)/i)).toHaveLength(2);
		});
	});

	it("hides after response", async () => {
		let resolvingPromise: (value: undefined) => void;
		const onRespond = jest.fn(
			() =>
				new Promise<void>((resolve) => {
					resolvingPromise = resolve;
				}),
		);

		const { getByText, queryByText } = render(
			<QuestionCard
				question={mockQuestion}
				questions={[
					{
						question: "Choose",
						header: "Options",
						options: [{ label: "Option A", description: "First" }],
					},
				]}
				onRespond={onRespond}
				onReject={mockReject}
			/>,
		);

		const option = getByText(/option a/i);
		fireEvent.press(option);

		const confirm = getByText(/confirm/i);
		fireEvent.press(confirm);

		await waitFor(() => {
			expect(onRespond).toHaveBeenCalled();
		});

		resolvingPromise?.();

		await waitFor(() => {
			expect(queryByText(/input needed/i)).toBeNull();
		});
	});
});
