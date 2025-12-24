import { beforeEach, describe, expect, it, jest } from "bun:test";
import { API } from "@coder/sdk";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { SessionProvider } from "@/lib/auth";
import { AuthMethodsStep } from "./auth-methods-step";

// Mock API
jest.mock("@coder/sdk", () => ({
	API: {
		getAuthMethods: jest.fn(),
		login: jest.fn(),
		setSessionToken: jest.fn(),
	},
}));

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
			<SessionProvider>
				<AuthMethodsStep
					onAuthenticated={jest.fn()}
					onDeviceFlowStart={jest.fn()}
				/>
			</SessionProvider>,
		);

		expect(await findByText("GitHub")).toBeTruthy();
		expect(getByPlaceholderText("Email")).toBeTruthy();
		expect(getByPlaceholderText("Password")).toBeTruthy();
	});

	it("calls login on password submit", async () => {
		(API.getAuthMethods as jest.Mock).mockResolvedValue({
			password: { enabled: true },
			github: { enabled: false },
		});
		(API.login as jest.Mock).mockResolvedValue({ session_token: "token-123" });
		const onAuthenticated = jest.fn();

		const { getByText, getByPlaceholderText, findByText } = render(
			<SessionProvider>
				<AuthMethodsStep
					onAuthenticated={onAuthenticated}
					onDeviceFlowStart={jest.fn()}
				/>
			</SessionProvider>,
		);

		// Wait for auth methods to load
		await findByText("Sign In");

		fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
		fireEvent.changeText(getByPlaceholderText("Password"), "password");
		fireEvent.press(getByText("Sign In"));

		await waitFor(() => {
			expect(API.login).toHaveBeenCalledWith("test@example.com", "password");
			expect(onAuthenticated).toHaveBeenCalled();
		});
	});

	it("calls onDeviceFlowStart when clicking oauth provider", async () => {
		(API.getAuthMethods as jest.Mock).mockResolvedValue({
			password: { enabled: true },
			github: { enabled: true, name: "GitHub" },
		});
		const onDeviceFlowStart = jest.fn();

		const { findByText } = render(
			<SessionProvider>
				<AuthMethodsStep
					onAuthenticated={jest.fn()}
					onDeviceFlowStart={onDeviceFlowStart}
				/>
			</SessionProvider>,
		);

		const githubBtn = await findByText("GitHub");
		fireEvent.press(githubBtn);

		expect(onDeviceFlowStart).toHaveBeenCalledWith("github");
	});
});
