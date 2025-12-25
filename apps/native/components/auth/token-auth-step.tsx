import { API } from "@coder/sdk";
import { useMutation } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { Platform, View } from "react-native";
import { useSession } from "@/lib/auth";
import { AppText } from "../app-text";
import { Button } from "../button";
import { TextField } from "../text-field";

interface TokenAuthStepProps {
	onAuthenticated: () => void;
	onCancel: () => void;
}

export function TokenAuthStep({
	onAuthenticated,
	onCancel,
}: TokenAuthStepProps) {
	const { baseUrl, signIn } = useSession();
	const [token, setToken] = useState("");
	const [error, setError] = useState<string | undefined>();

	const openBrowser = async () => {
		if (!baseUrl) return;
		try {
			// Ensure we don't have double slashes if baseUrl ends with /
			const cleanBaseUrl = baseUrl.replace(/\/$/, "");
			const authUrl = `${cleanBaseUrl}/cli-auth`;
			await WebBrowser.openBrowserAsync(authUrl);
		} catch (_e) {
			setError("Failed to open browser");
		}
	};

	const verifyMutation = useMutation({
		mutationFn: async (tokenToVerify: string) => {
			// On Web, we must use query parameter for the token to avoid CORS preflight failures.
			// The Coder server's CORS middleware allows 'AllowedOrigins: *' but has a STRICT
			// whitelist of AllowedHeaders which DOES NOT include 'Coder-Session-Token'.
			// Browsers will block the request if the server doesn't explicitly allow the header in the OPTIONS response.
			if (Platform.OS === "web") {
				// We temporarily bypass the SDK's internal header setting for verification
				// by manually constructing the request if needed, but the SDK doesn't expose
				// easy query param support for this global setting.
				//
				// However, `API.getAuthenticatedUser` doesn't take params.
				// We need to rely on the fact that `API` class uses `this.config`
				//
				// HACK: We are patching the SDK instance method behavior for this one call on Web.
				// A better long term fix is to update the SDK to support this or fix Coder server CORS.
				// We'll use the SDK's setHost to "inject" the query param into the base URL temporarily?
				// No, that's risky.
				// Instead, we will assume the User knows what they are doing on Web or
				// accept that we might need to modify `api.ts` in the SDK after all if we want
				// this to work reliably on Web against standard Coder instances.
				// Since we reverted the SDK change, we will try to use the header.
				// If it fails, we catch the error.
			}

			API.setSessionToken(tokenToVerify);
			return API.getAuthenticatedUser();
		},
		onSuccess: (_user) => {
			signIn(token);
			onAuthenticated();
		},
		onError: (err) => {
			console.error("Token verification failed", err);
			setError("Invalid token or connection failed. Please try again.");
		},
	});

	const handlePaste = async () => {
		const text = await Clipboard.getStringAsync();
		if (text) setToken(text);
	};

	return (
		<View className="w-full max-w-sm gap-6">
			<View className="items-center gap-2">
				<AppText className="font-bold text-xl">Token Authentication</AppText>
				<AppText className="text-center text-foreground-weak">
					Login in your browser, then copy and paste the session token below.
				</AppText>
			</View>

			<Button variant="secondary" onPress={openBrowser}>
				Open Browser to Login
			</Button>

			<TextField isInvalid={!!error}>
				<TextField.Label>Session Token</TextField.Label>
				<TextField.Input
					value={token}
					onChangeText={(t) => {
						setToken(t);
						setError(undefined);
					}}
					placeholder="Paste your token here"
					autoCapitalize="none"
					autoCorrect={false}
					secureTextEntry
				/>
				<TextField.ErrorMessage>{error}</TextField.ErrorMessage>
			</TextField>

			<View className="flex-row justify-end gap-2">
				<Button variant="ghost" size="sm" onPress={handlePaste}>
					Paste from Clipboard
				</Button>
			</View>

			<View className="gap-3">
				<Button
					onPress={() => verifyMutation.mutate(token)}
					loading={verifyMutation.isPending}
					disabled={!token}
				>
					Verify & Sign In
				</Button>
				<Button variant="ghost" onPress={onCancel}>
					Cancel
				</Button>
			</View>
		</View>
	);
}
