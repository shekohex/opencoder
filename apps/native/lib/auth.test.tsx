import { act, renderHook, waitFor } from "@testing-library/react-native";
import type React from "react";
import { SessionProvider, useSession } from "./auth";

jest.mock("expo-secure-store", () => ({
	getItemAsync: jest.fn(async () => null),
	setItemAsync: jest.fn(async () => undefined),
	deleteItemAsync: jest.fn(async () => undefined),
}));

describe("SessionProvider", () => {
	it("should provide baseUrl and session token", async () => {
		const wrapper = ({ children }: { children: React.ReactNode }) => (
			<SessionProvider>{children}</SessionProvider>
		);

		const { result } = renderHook(() => useSession(), { wrapper });

		expect(result.current.baseUrl).toBeNull();
		expect(result.current.session).toBeNull();

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		await act(async () => {
			result.current.setBaseUrl("https://coder.example.com");
			result.current.signIn("token-123");
		});

		await waitFor(() => {
			expect(result.current.baseUrl).toBe("https://coder.example.com");
			expect(result.current.session).toBe("token-123");
		});
	});
});
