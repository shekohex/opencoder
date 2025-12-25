import type { Href } from "expo-router";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { AuthMethodsStep } from "@/components/auth/auth-methods-step";
import { BaseUrlStep } from "@/components/auth/base-url-step";
import { TokenAuthStep } from "@/components/auth/token-auth-step";
import { Container } from "@/components/container";
import { useSession } from "@/lib/auth";

type Step = "base-url" | "auth-methods" | "token-auth";

export default function SignIn() {
	const { baseUrl } = useSession();
	const { redirectTo } = useLocalSearchParams<{ redirectTo?: string }>();
	const [_step, setStep] = useState<Step>("base-url");

	const handleBaseUrlNext = () => {
		setStep("auth-methods");
	};

	const handleAuthenticated = () => {
		const destination = (redirectTo || "/") as Href;
		router.replace(destination);
	};

	const handleTokenAuthStart = () => {
		setStep("token-auth");
	};

	const handleTokenAuthCancel = () => {
		setStep("auth-methods");
	};

	const renderStep = () => {
		if (_step === "token-auth") {
			return (
				<TokenAuthStep
					onAuthenticated={handleAuthenticated}
					onCancel={handleTokenAuthCancel}
				/>
			);
		}

		if (!baseUrl) {
			return <BaseUrlStep onNext={handleBaseUrlNext} />;
		}

		return (
			<AuthMethodsStep
				onAuthenticated={handleAuthenticated}
				onTokenAuthStart={handleTokenAuthStart}
			/>
		);
	};

	return (
		<Container
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				padding: 16,
			}}
		>
			{renderStep()}
		</Container>
	);
}
