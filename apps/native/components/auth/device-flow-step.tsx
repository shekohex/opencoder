import { API } from "@coder/sdk";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import { useEffect, useRef } from "react";
import { ActivityIndicator, Linking, View } from "react-native";
import { useSession } from "@/lib/auth";

import { AppText } from "../app-text";
import { Button } from "../button";
import { CodeText } from "../code-text";

interface DeviceFlowStepProps {
	provider: string;
	providerName: string;
	onAuthenticated: () => void;
	onCancel: () => void;
}

export function DeviceFlowStep({
	provider,
	providerName,
	onAuthenticated,
	onCancel,
}: DeviceFlowStepProps) {
	const { signIn } = useSession();
	const pollInterval = useRef<ReturnType<typeof setInterval> | null>(null);

	const deviceStart = useQuery({
		queryKey: ["deviceStart", provider],
		queryFn: async () => {
			return API.getExternalAuthDevice(provider);
		},
	});

	const exchangeMutation = useMutation({
		mutationFn: async (deviceCode: string) => {
			// We need to bypass the strict typing or update it.
			// API.exchangeExternalAuthDevice returns Promise<void> but we expect session token in response.
			return (await API.exchangeExternalAuthDevice(provider, {
				device_code: deviceCode,
			})) as unknown as { session_token: string };
		},
		onSuccess: (data) => {
			if (data?.session_token) {
				signIn(data.session_token);
				onAuthenticated();
			}
		},
	});

	useEffect(() => {
		if (deviceStart.data) {
			const { device_code, interval } = deviceStart.data;
			const pollMs = (interval || 5) * 1000;

			const poll = () => {
				exchangeMutation.mutate(device_code);
			};

			pollInterval.current = setInterval(poll, pollMs);
		}

		return () => {
			if (pollInterval.current) clearInterval(pollInterval.current);
		};
	}, [deviceStart.data, exchangeMutation.mutate]);

	const handleCopy = async () => {
		if (deviceStart.data?.user_code) {
			await Clipboard.setStringAsync(deviceStart.data.user_code);
		}
	};

	const handleOpen = () => {
		if (deviceStart.data?.verification_uri) {
			Linking.openURL(deviceStart.data.verification_uri);
		}
	};

	if (deviceStart.isLoading) {
		return (
			<View className="items-center justify-center p-8">
				<ActivityIndicator size="large" />
				<AppText className="mt-4">Starting authentication...</AppText>
			</View>
		);
	}

	if (deviceStart.isError) {
		return (
			<View className="items-center justify-center p-8">
				<AppText className="mb-4 text-foreground-critical">
					Failed to start authentication.
				</AppText>
				<Button onPress={onCancel} variant="secondary">
					Go Back
				</Button>
			</View>
		);
	}

	const { user_code } = deviceStart.data || {};

	return (
		<View className="w-full max-w-sm items-center gap-6">
			<View className="items-center gap-2">
				<AppText className="text-center font-bold text-2xl">
					Authenticate with {providerName}
				</AppText>
				<AppText className="text-center text-foreground-weak">
					Copy your one-time code:
				</AppText>
			</View>

			<View className="flex-row items-center gap-2">
				<CodeText className="font-bold text-2xl">{user_code}</CodeText>
				<Button
					variant="ghost"
					size="sm"
					onPress={handleCopy}
					accessibilityLabel="Copy code"
					className="px-2"
				>
					📋
				</Button>
			</View>

			<AppText className="text-center text-foreground-weak">
				Then open the link below and paste it:
			</AppText>

			<Button onPress={handleOpen} variant="ghost" className="text-accent">
				Open and Paste
			</Button>

			<View className="mt-4 flex-row items-center gap-2">
				<ActivityIndicator size="small" />
				<AppText className="text-foreground-weak">
					Checking for authentication...
				</AppText>
			</View>

			<Button onPress={onCancel} variant="secondary" className="mt-4 w-full">
				Cancel
			</Button>
		</View>
	);
}
