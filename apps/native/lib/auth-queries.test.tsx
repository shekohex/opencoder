import { API } from "@coder/sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import type React from "react";
import { useAuthMethods, useLogin } from "./auth-queries";

jest.mock("@coder/sdk", () => ({
	API: {
		getAuthMethods: jest.fn(),
		login: jest.fn(),
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
});
