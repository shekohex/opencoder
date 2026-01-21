import { Icon, Logo } from "@opencoder/branding";
import { useState } from "react";
import { View } from "react-native";
import { useSession } from "@/lib/auth";
import { useTheme } from "@/lib/theme-context";
import { AppText } from "../app-text";
import { Button } from "../button";
import { TextField } from "../text-field";

interface BaseUrlStepProps {
	onNext: () => void;
}

export function BaseUrlStep({ onNext }: BaseUrlStepProps) {
	const { setBaseUrl } = useSession();
	const { mode } = useTheme();
	const [url, setUrl] = useState("");
	const [error, setError] = useState<string | undefined>();

	const handleSubmit = () => {
		setError(undefined);
		let normalizedUrl = url.trim();
		if (!normalizedUrl) {
			setError("URL is required");
			return;
		}

		if (
			!normalizedUrl.startsWith("http://") &&
			!normalizedUrl.startsWith("https://")
		) {
			normalizedUrl = `https://${normalizedUrl}`;
		}

		try {
			new URL(normalizedUrl);
		} catch {
			setError("Invalid URL");
			return;
		}

		setBaseUrl(normalizedUrl);
		onNext();
	};

	return (
		<View className="w-full max-w-sm gap-5">
			<View className="items-center gap-4">
				<Icon mode={mode} size={32} />
				<Logo mode={mode} width={140} height={28} />
				<AppText className="text-center text-foreground-weak text-sm">
					Enter your Coder deployment URL to continue
				</AppText>
			</View>

			<TextField isInvalid={!!error}>
				<TextField.Label>Coder URL</TextField.Label>
				<TextField.Input
					placeholder="https://coder.example.com"
					value={url}
					onChangeText={(text) => {
						setUrl(text);
						setError(undefined);
					}}
					autoCapitalize="none"
					autoCorrect={false}
					keyboardType="url"
					returnKeyType="go"
					onSubmitEditing={handleSubmit}
				/>
				<TextField.ErrorMessage>{error}</TextField.ErrorMessage>
			</TextField>

			<Button onPress={handleSubmit} className="w-full">
				Continue
			</Button>
		</View>
	);
}
