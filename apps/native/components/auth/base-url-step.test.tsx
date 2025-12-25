import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import type React from "react";
import { SessionProvider } from "@/lib/auth";
import { FontProvider } from "@/lib/font-context";
import { ThemeProvider } from "@/lib/theme-context";
import { BaseUrlStep } from "./base-url-step";

// Mock API
jest.mock("@coder/sdk", () => ({
	API: {
		getAuthMethods: jest.fn(),
		setHost: jest.fn(),
		setProxyTarget: jest.fn(),
	},
}));

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});

	return ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<FontProvider>
					<SessionProvider>{children}</SessionProvider>
				</FontProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
};

describe("BaseUrlStep", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("validates invalid URL", async () => {
		const { getByPlaceholderText, getByText } = render(
			<BaseUrlStep onNext={jest.fn()} />,
			{ wrapper: createWrapper() },
		);

		const input = getByPlaceholderText("https://coder.example.com");
		fireEvent.changeText(input, "https://");
		fireEvent.press(getByText("Continue"));

		await waitFor(() => {
			expect(getByText("Invalid URL")).toBeTruthy();
		});
	});

	it("accepts valid URL and calls onNext", async () => {
		// (API.getAuthMethods as jest.Mock).mockResolvedValue({});
		const onNext = jest.fn();

		const { getByPlaceholderText, getByText } = render(
			<BaseUrlStep onNext={onNext} />,
			{ wrapper: createWrapper() },
		);

		const input = getByPlaceholderText("https://coder.example.com");
		fireEvent.changeText(input, "coder.example.com"); // Should auto-prefix https
		fireEvent.press(getByText("Continue"));

		await waitFor(() => {
			expect(onNext).toHaveBeenCalled();
		});
	});
});
