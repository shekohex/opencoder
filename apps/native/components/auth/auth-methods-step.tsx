import { API, type AuthMethods } from "@coder/sdk";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { View } from "react-native";
import { useSession } from "@/lib/auth";

import { AppText } from "../app-text";
import { Button } from "../button";
import { TextField } from "../text-field";

interface AuthMethodsStepProps {
	onAuthenticated: () => void;
	onDeviceFlowStart: (providerId: string) => void;
}

export function AuthMethodsStep({
	onAuthenticated,
	onDeviceFlowStart,
}: AuthMethodsStepProps) {
	const { signIn } = useSession();
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

	const methods = (authMethodsQuery.data || {}) as AuthMethods;
	const hasPassword = methods.password?.enabled;
	// Filter for GitHub or OIDC or whatever we support.
	// For now, we iterate keys and show buttons for non-password/built-in
	const oauthProviders = Object.entries(methods).filter(
		([key, value]) => key !== "password" && value.enabled,
	);

	return (
		<View className="w-full max-w-sm gap-6">
			<View className="mb-2 items-center gap-4">
				<View className="rounded-xl bg-surface-active p-4">
					<AppText className="font-bold text-4xl">C</AppText>
				</View>
				<AppText className="font-bold text-2xl">Coder</AppText>
			</View>

			{oauthProviders.length > 0 && (
				<View className="gap-3">
					{oauthProviders.map(([key, value]) => (
						<Button
							key={key}
							variant="secondary"
							onPress={() => onDeviceFlowStart(key)}
							leftIcon={
								key === "github" ? (
									// In a real app we'd use simple-icons SVG
									// For now text or maybe an image if we had one
									<AppText>🐙</AppText>
								) : undefined
							}
						>
							{value.name || key}
						</Button>
					))}
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
