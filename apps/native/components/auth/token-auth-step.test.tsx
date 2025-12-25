import { API } from "@coder/sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import * as Clipboard from "expo-clipboard";
import * as WebBrowser from "expo-web-browser";
import type React from "react";
import { SessionProvider } from "@/lib/auth";
import { FontProvider } from "@/lib/font-context";
import { ThemeProvider } from "@/lib/theme-context";
import { TokenAuthStep } from "./token-auth-step";

// Mock API
jest.mock("@coder/sdk", () => ({
	API: {
		getAuthenticatedUser: jest.fn(),
		setSessionToken: jest.fn(),
		setHost: jest.fn(),
	},
}));

jest.mock("expo-web-browser", () => ({
	openBrowserAsync: jest.fn(),
}));

jest.mock("expo-clipboard", () => ({
	getStringAsync: jest.fn(),
}));

const mockSignIn = jest.fn();

jest.mock("@/lib/auth", () => {
	// Require actual to keep SessionProvider (though we won't strictly use its value if we mock useSession)
	// But if TokenAuthStep uses useSession, and we mock it, we don't need SessionProvider to work fully.
	return {
		useSession: () => ({
			baseUrl: "https://coder.example.com",
			signIn: mockSignIn,
		}),
		SessionProvider: ({ children }: { children: React.ReactNode }) => children,
	};
});

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

describe("TokenAuthStep", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("opens browser on button click", async () => {
		const { getByText } = render(
			<TokenAuthStep onAuthenticated={jest.fn()} onCancel={jest.fn()} />,
			{ wrapper: createWrapper() },
		);

		fireEvent.press(getByText("Open Browser to Login"));
		expect(WebBrowser.openBrowserAsync).toHaveBeenCalledWith(
			"https://coder.example.com/cli-auth",
		);
	});

	it("pastes token from clipboard", async () => {
		(Clipboard.getStringAsync as jest.Mock).mockResolvedValue(
			"token-from-clip",
		);

		const { getByText, getByPlaceholderText } = render(
			<TokenAuthStep onAuthenticated={jest.fn()} onCancel={jest.fn()} />,
			{ wrapper: createWrapper() },
		);

		fireEvent.press(getByText("Paste from Clipboard"));
		await waitFor(() => {
			expect(getByPlaceholderText("Paste your token here").props.value).toBe(
				"token-from-clip",
			);
		});
	});

	it("verifies token and signs in", async () => {
		const onAuthenticated = jest.fn();
		(API.getAuthenticatedUser as jest.Mock).mockResolvedValue({ id: "user-1" });

		const { getByText, getByPlaceholderText } = render(
			<TokenAuthStep onAuthenticated={onAuthenticated} onCancel={jest.fn()} />,
			{ wrapper: createWrapper() },
		);

		fireEvent.changeText(
			getByPlaceholderText("Paste your token here"),
			"my-token",
		);
		fireEvent.press(getByText("Verify & Sign In"));

		await waitFor(() => {
			expect(API.setSessionToken).toHaveBeenCalledWith("my-token");
			expect(API.getAuthenticatedUser).toHaveBeenCalled();
			expect(mockSignIn).toHaveBeenCalledWith("my-token");
			expect(onAuthenticated).toHaveBeenCalled();
		});
	});

	it("shows error on invalid token", async () => {
		(API.getAuthenticatedUser as jest.Mock).mockRejectedValue(
			new Error("Invalid"),
		);

		const { getByText, getByPlaceholderText, findByText } = render(
			<TokenAuthStep onAuthenticated={jest.fn()} onCancel={jest.fn()} />,
			{ wrapper: createWrapper() },
		);

		fireEvent.changeText(
			getByPlaceholderText("Paste your token here"),
			"bad-token",
		);
		fireEvent.press(getByText("Verify & Sign In"));

		expect(await findByText("Invalid token. Please try again.")).toBeTruthy();
	});
});
