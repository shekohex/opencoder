import { API } from "@coder/sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import type React from "react";
import { SessionProvider } from "@/lib/auth";
import { FontProvider } from "@/lib/font-context";
import { ThemeProvider } from "@/lib/theme-context";
import { AuthMethodsStep } from "./auth-methods-step";

// Mock API
jest.mock("@coder/sdk", () => ({
	API: {
		getAuthMethods: jest.fn(),
		login: jest.fn(),
		setSessionToken: jest.fn(),
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

describe("AuthMethodsStep", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders password login and oauth buttons", async () => {
		(API.getAuthMethods as jest.Mock).mockResolvedValue({
			password: { enabled: true },
			github: { enabled: true, name: "GitHub" },
		});

		const { findByText, getByPlaceholderText } = render(
			<AuthMethodsStep
				onAuthenticated={jest.fn()}
				onTokenAuthStart={jest.fn()}
			/>,
			{ wrapper: createWrapper() },
		);

		expect(await findByText("Login via Browser")).toBeTruthy();
		expect(getByPlaceholderText("user@example.com")).toBeTruthy();
		expect(getByPlaceholderText("password")).toBeTruthy();
	});

	it("calls login on password submit", async () => {
		(API.getAuthMethods as jest.Mock).mockResolvedValue({
			password: { enabled: true },
			github: { enabled: false },
		});
		(API.login as jest.Mock).mockResolvedValue({ session_token: "token-123" });
		const onAuthenticated = jest.fn();

		const { getByText, getByPlaceholderText, findByText } = render(
			<AuthMethodsStep
				onAuthenticated={onAuthenticated}
				onTokenAuthStart={jest.fn()}
			/>,
			{ wrapper: createWrapper() },
		);

		// Wait for auth methods to load
		await findByText("Sign In");

		fireEvent.changeText(
			getByPlaceholderText("user@example.com"),
			"test@example.com",
		);
		fireEvent.changeText(getByPlaceholderText("password"), "password");
		fireEvent.press(getByText("Sign In"));

		await waitFor(() => {
			expect(API.login).toHaveBeenCalledWith("test@example.com", "password");
			expect(onAuthenticated).toHaveBeenCalled();
		});
	});

	it("calls onTokenAuthStart when clicking login via browser", async () => {
		(API.getAuthMethods as jest.Mock).mockResolvedValue({
			password: { enabled: true },
			github: { enabled: true, name: "GitHub" },
		});
		const onTokenAuthStart = jest.fn();

		const { findByText } = render(
			<AuthMethodsStep
				onAuthenticated={jest.fn()}
				onTokenAuthStart={onTokenAuthStart}
			/>,
			{ wrapper: createWrapper() },
		);

		const btn = await findByText("Login via Browser");
		fireEvent.press(btn);

		expect(onTokenAuthStart).toHaveBeenCalled();
	});
});
