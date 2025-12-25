import { API } from "@coder/sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import type React from "react";
import {
	useAuthMethods,
	useGitHubDeviceCallback,
	useGitHubDeviceStart,
	useLogin,
} from "./auth-queries";

jest.mock("@coder/sdk", () => ({
	API: {
		getAuthMethods: jest.fn(),
		login: jest.fn(),
		getOAuth2GitHubDevice: jest.fn(),
		getOAuth2GitHubDeviceFlowCallback: jest.fn(),
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
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

describe("auth-queries", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("useAuthMethods calls API.getAuthMethods", async () => {
		(API.getAuthMethods as jest.Mock).mockResolvedValue({
			password: { enabled: true },
			github: { enabled: false, default_provider_configured: false },
			oidc: { enabled: false },
		});

		const { result } = renderHook(() => useAuthMethods(), {
			wrapper: createWrapper(),
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual({
			password: { enabled: true },
			github: { enabled: false, default_provider_configured: false },
			oidc: { enabled: false },
		});
	});

	it("useLogin calls API.login", async () => {
		(API.login as jest.Mock).mockResolvedValue({ session_token: "token" });

		const { result } = renderHook(() => useLogin(), {
			wrapper: createWrapper(),
		});

		result.current.mutate({ email: "user", password: "pwd" });

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(API.login).toHaveBeenCalledWith("user", "pwd");
	});

	it("useGitHubDeviceStart calls API.getOAuth2GitHubDevice", async () => {
		(API.getOAuth2GitHubDevice as jest.Mock).mockResolvedValue({
			user_code: "123",
		});

		const { result } = renderHook(() => useGitHubDeviceStart(), {
			wrapper: createWrapper(),
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(API.getOAuth2GitHubDevice).toHaveBeenCalled();
	});

	it("useGitHubDeviceCallback calls API.getOAuth2GitHubDeviceFlowCallback", async () => {
		(API.getOAuth2GitHubDeviceFlowCallback as jest.Mock).mockResolvedValue({
			redirect_url: "/",
		});

		const { result } = renderHook(() => useGitHubDeviceCallback(), {
			wrapper: createWrapper(),
		});

		result.current.mutate({ deviceCode: "device-code", state: "state-123" });

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(API.getOAuth2GitHubDeviceFlowCallback).toHaveBeenCalledWith(
			"device-code",
			"state-123",
		);
	});
});
