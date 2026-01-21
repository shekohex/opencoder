import { API } from "@coder/sdk";
import { Icon } from "@opencoder/branding";
import { useMutation } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { View } from "react-native";
import { useSession } from "@/lib/auth";
import { useTheme } from "@/lib/theme-context";
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
	const { mode } = useTheme();
	const [token, setToken] = useState("");
	const [error, setError] = useState<string | undefined>();

	const openBrowser = async () => {
		if (!baseUrl) return;
		try {
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
		<View className="w-full max-w-sm gap-5">
			<View className="items-center gap-4">
				<Icon mode={mode} size={32} />
				<AppText className="text-center font-semibold text-foreground text-xl">
					Session Token
				</AppText>
				<AppText className="text-center text-foreground-weak text-sm">
					Open your browser to sign in, then paste the session token below
				</AppText>
			</View>

			<Button variant="secondary" onPress={openBrowser} className="w-full">
				Open Browser
			</Button>

			<View className="flex-col gap-2">
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

				<Button
					variant="ghost"
					size="sm"
					onPress={handlePaste}
					className="self-end"
				>
					Paste from Clipboard
				</Button>
			</View>

			<View className="gap-3">
				<Button
					onPress={() => verifyMutation.mutate(token)}
					loading={verifyMutation.isPending}
					disabled={!token}
					className="w-full"
				>
					Sign In
				</Button>
				<Button variant="ghost" onPress={onCancel} className="w-full">
					Back
				</Button>
			</View>
		</View>
	);
}
