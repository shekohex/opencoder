import { API, type TypesGen } from "@coder/sdk";
import { Icon } from "@opencoder/branding";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { View } from "react-native";
import { useSession } from "@/lib/auth";
import { useTheme } from "@/lib/theme-context";

import { AppText } from "../app-text";
import { Button } from "../button";
import { TextField } from "../text-field";

interface AuthMethodsStepProps {
	onAuthenticated: () => void;
	onTokenAuthStart: () => void;
}

export function AuthMethodsStep({
	onAuthenticated,
	onTokenAuthStart,
}: AuthMethodsStepProps) {
	const { signIn } = useSession();
	const { mode } = useTheme();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | undefined>();

	const authMethodsQuery = useQuery({
		queryKey: ["authMethods"],
		queryFn: () => API.getAuthMethods(),
	});

	const loginMutation = useMutation({
		mutationFn: async () => {
			return API.login(email, password);
		},
		onSuccess: (data) => {
			signIn(data.session_token);
			onAuthenticated();
		},
		onError: () => {
			setError("Invalid credentials. Please try again.");
		},
	});

	const handlePasswordLogin = () => {
		setError(undefined);
		if (!email || !password) {
			setError("Email and password are required");
			return;
		}
		loginMutation.mutate();
	};

	if (authMethodsQuery.isLoading) {
		return (
			<View className="flex-1 items-center justify-center">
				<AppText>Loading auth methods...</AppText>
			</View>
		);
	}

	const methods = (authMethodsQuery.data || {}) as TypesGen.AuthMethods;
	const hasPassword = methods.password?.enabled;
	// Filter for GitHub or OIDC or whatever we support.
	// For now, we iterate keys and show buttons for non-password/built-in
	const oauthProviders = Object.entries(methods).filter(
		([key, value]) =>
			key !== "password" && (value as { enabled: boolean }).enabled,
	);

	return (
		<View className="w-full max-w-sm gap-5">
			<View className="items-center gap-4">
				<Icon mode={mode} size={32} />
				<AppText className="text-center font-semibold text-foreground text-xl">
					Sign in to Coder
				</AppText>
			</View>

			{oauthProviders.length > 0 && (
				<View className="gap-3">
					{oauthProviders.map(([providerId]) => (
						<Button
							key={providerId}
							variant="secondary"
							onPress={onTokenAuthStart}
						>
							Sign in with{" "}
							{providerId.charAt(0).toUpperCase() + providerId.slice(1)}
						</Button>
					))}
				</View>
			)}

			{oauthProviders.length > 0 && hasPassword && (
				<View className="flex-row items-center gap-3 py-2">
					<View className="h-px flex-1 bg-border" />
					<AppText className="text-foreground-weak text-xs uppercase">
						Or continue with
					</AppText>
					<View className="h-px flex-1 bg-border" />
				</View>
			)}

			{hasPassword && (
				<View className="gap-5">
					<TextField>
						<TextField.Label>Email</TextField.Label>
						<TextField.Input
							placeholder="user@example.com"
							value={email}
							onChangeText={setEmail}
							autoCapitalize="none"
							keyboardType="email-address"
						/>
					</TextField>

					<TextField isInvalid={!!error}>
						<TextField.Label>Password</TextField.Label>
						<TextField.Input
							placeholder="password"
							value={password}
							onChangeText={setPassword}
							secureTextEntry
						/>
						<TextField.ErrorMessage>{error}</TextField.ErrorMessage>
					</TextField>

					<Button
						onPress={handlePasswordLogin}
						loading={loginMutation.isPending}
						className="w-full"
					>
						Sign In
					</Button>
				</View>
			)}
		</View>
	);
}
