import { API } from "@coder/sdk";
import { useMutation } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { View } from "react-native";
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
			API.setSessionToken(tokenToVerify);
			return API.getAuthenticatedUser();
		},
		onSuccess: (_user) => {
			signIn(token);
			onAuthenticated();
		},
		onError: (_err) => {
			setError("Invalid token. Please try again.");
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
