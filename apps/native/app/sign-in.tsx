import { useState } from "react";
import { AuthMethodsStep } from "@/components/auth/auth-methods-step";
import { BaseUrlStep } from "@/components/auth/base-url-step";
import { Container } from "@/components/container";
import { useSession } from "@/lib/auth";

export default function SignIn() {
	const { baseUrl } = useSession();
	const [_step, setStep] = useState<"base-url" | "auth-methods">("base-url");

	const handleBaseUrlNext = () => {
		setStep("auth-methods");
	};

	const handleAuthenticated = () => {
		// Layout should redirect
	};

	const handleDeviceFlowStart = (provider: string) => {
		// Next task
		console.log("Start device flow for", provider);
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
			{!baseUrl ? (
				<BaseUrlStep onNext={handleBaseUrlNext} />
			) : (
				<AuthMethodsStep
					onAuthenticated={handleAuthenticated}
					onDeviceFlowStart={handleDeviceFlowStart}
				/>
			)}
		</Container>
	);
}
