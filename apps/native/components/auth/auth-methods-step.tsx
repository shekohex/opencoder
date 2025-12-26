import { API, type TypesGen } from "@coder/sdk";
import { Icon, Logo } from "@opencoder/branding";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
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
		<View className="w-full max-w-sm gap-6">
			<View className="mb-2 items-center gap-4">
				<Icon mode={mode} size={80} />
				<Logo mode={mode} width={250} height={50} />
			</View>

			{oauthProviders.length > 0 && (
				<View className="gap-3">
					<Button
						variant="secondary"
						onPress={onTokenAuthStart}
						leftIcon={
							<Svg
								viewBox="0 0 24 24"
								width={16}
								height={16}
								fill="currentColor"
							>
								<Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
							</Svg>
						}
					>
						Login via Browser
					</Button>
				</View>
			)}

			{oauthProviders.length > 0 && hasPassword && (
				<View className="flex-row items-center gap-2">
					<View className="h-px flex-1 bg-border" />
					<AppText className="text-foreground-weak text-xs uppercase">
						Or
					</AppText>
					<View className="h-px flex-1 bg-border" />
				</View>
			)}

			{hasPassword && (
				<View className="gap-4">
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
