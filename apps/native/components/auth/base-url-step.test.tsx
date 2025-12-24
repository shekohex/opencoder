import { beforeEach, describe, expect, it, jest } from "bun:test";
import { API } from "@coder/sdk";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { SessionProvider } from "@/lib/auth";
import { BaseUrlStep } from "./base-url-step";

// Mock API
jest.mock("@coder/sdk", () => ({
	API: {
		getAuthMethods: jest.fn(),
		setHost: jest.fn(),
	},
}));

describe("BaseUrlStep", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("validates invalid URL", async () => {
		const { getByPlaceholderText, getByText, queryByText } = render(
			<SessionProvider>
				<BaseUrlStep onNext={jest.fn()} />
			</SessionProvider>,
		);

		const input = getByPlaceholderText("https://coder.example.com");
		fireEvent.changeText(input, "invalid-url");
		fireEvent.press(getByText("Continue"));

		await waitFor(() => {
			expect(getByText("Invalid URL")).toBeTruthy();
		});
	});

	it("accepts valid URL and calls onNext", async () => {
		(API.getAuthMethods as jest.Mock).mockResolvedValue({});
		const onNext = jest.fn();

		const { getByPlaceholderText, getByText } = render(
			<SessionProvider>
				<BaseUrlStep onNext={onNext} />
			</SessionProvider>,
		);

		const input = getByPlaceholderText("https://coder.example.com");
		fireEvent.changeText(input, "coder.example.com"); // Should auto-prefix https
		fireEvent.press(getByText("Continue"));

		await waitFor(() => {
			expect(API.setHost).toHaveBeenCalledWith("https://coder.example.com");
			expect(onNext).toHaveBeenCalled();
		});
	});
});
