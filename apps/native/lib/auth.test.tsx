import { describe, expect, it } from "bun:test";
import { act, renderHook } from "@testing-library/react-native";
import type React from "react";
import { SessionProvider, useSession } from "./auth";

describe("SessionProvider", () => {
	it("should provide baseUrl and session token", async () => {
		const wrapper = ({ children }: { children: React.ReactNode }) => (
			<SessionProvider>{children}</SessionProvider>
		);

		const { result } = renderHook(() => useSession(), { wrapper });

		expect(result.current.baseUrl).toBeNull();
		expect(result.current.session).toBeNull();

		act(() => {
			// @ts-expect-error - baseUrl not implemented yet
			result.current.setBaseUrl("https://coder.example.com");
			result.current.signIn("token-123");
		});

		// We expect these to update (after async storage maybe?)
		// For now we just check if the methods exist and update state eventually.
		// Since useStorageState is async/effect based, we might need waitFor or similar if we were being strict.
		// But failing test first: type error above or runtime undefined check.

		// This part will fail because setBaseUrl doesn't exist on the context
		expect(result.current.baseUrl).toBe("https://coder.example.com");
		expect(result.current.session).toBe("token-123");
	});
});
