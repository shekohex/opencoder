import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render } from "@testing-library/react-native";
import type React from "react";
import SignIn from "@/app/sign-in";
import { useSession } from "@/lib/auth";
import { FontProvider } from "@/lib/font-context";
import { ThemeProvider } from "@/lib/theme-context";

// Mock API and dependencies
jest.mock("@coder/sdk", () => ({
	API: {
		getAuthMethods: jest.fn().mockResolvedValue({
			password: { enabled: true },
			github: { enabled: true, name: "GitHub" },
		}),
		login: jest.fn(),
		setSessionToken: jest.fn(),
		getAuthenticatedUser: jest.fn().mockResolvedValue({ id: "me" }),
	},
}));

jest.mock("expo-web-browser", () => ({
	openBrowserAsync: jest.fn(),
}));

jest.mock("expo-clipboard", () => ({
	getStringAsync: jest.fn(),
}));

jest.mock("@/lib/auth", () => ({
	useSession: jest.fn(),
}));

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});
	return ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<FontProvider>{children}</FontProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
};

describe("SignIn Screen", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders BaseUrlStep when no baseUrl is set", async () => {
		(useSession as jest.Mock).mockReturnValue({
			baseUrl: null,
			signIn: jest.fn(),
		});

		const { findByText, getByPlaceholderText } = render(<SignIn />, {
			wrapper: createWrapper(),
		});

		expect(await findByText("Enter Coder URL")).toBeTruthy();
		expect(getByPlaceholderText("https://coder.example.com")).toBeTruthy();
	});

	it("renders AuthMethodsStep when baseUrl is set", async () => {
		(useSession as jest.Mock).mockReturnValue({
			baseUrl: "https://coder.example.com",
			signIn: jest.fn(),
		});

		const { findByText } = render(<SignIn />, {
			wrapper: createWrapper(),
		});

		expect(await findByText("Coder")).toBeTruthy();
		expect(await findByText("Login via Browser")).toBeTruthy();
	});

	it("navigates to TokenAuthStep and back", async () => {
		(useSession as jest.Mock).mockReturnValue({
			baseUrl: "https://coder.example.com",
			signIn: jest.fn(),
		});

		const { findByText, getByText } = render(<SignIn />, {
			wrapper: createWrapper(),
		});

		// Go to Token Auth
		const loginBtn = await findByText("Login via Browser");
		fireEvent.press(loginBtn);

		expect(await findByText("Token Authentication")).toBeTruthy();

		// Go back
		fireEvent.press(getByText("Cancel"));
		expect(await findByText("Coder")).toBeTruthy();
	});
});
