import { useState } from "react";
import { View } from "react-native";
import { useSession } from "@/lib/auth";
import { AppText } from "../app-text";
import { Button } from "../button";
import { TextField } from "../text-field";

interface BaseUrlStepProps {
	onNext: () => void;
}

export function BaseUrlStep({ onNext }: BaseUrlStepProps) {
	const { setBaseUrl } = useSession();
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

		// Skip API validation to avoid CORS issues on web
		setBaseUrl(normalizedUrl);
		onNext();
	};

	return (
		<View className="w-full max-w-sm gap-4">
			<View className="mb-4 items-center gap-2">
				<AppText className="font-bold text-2xl">Enter Coder URL</AppText>
				<AppText className="text-center text-foreground-weak">
					Enter the URL of your Coder deployment to continue.
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
