import { useState } from "react";
import { AuthMethodsStep } from "@/components/auth/auth-methods-step";
import { BaseUrlStep } from "@/components/auth/base-url-step";
import { DeviceFlowStep } from "@/components/auth/device-flow-step";
import { Container } from "@/components/container";
import { useSession } from "@/lib/auth";

type Step = "base-url" | "auth-methods" | "device-flow";

interface DeviceFlowState {
	providerName: string;
}

export default function SignIn() {
	const { baseUrl } = useSession();
	const [_step, setStep] = useState<Step>("base-url");
	const [deviceFlowState, setDeviceFlowState] =
		useState<DeviceFlowState | null>(null);

	const handleBaseUrlNext = () => {
		setStep("auth-methods");
	};

	const handleAuthenticated = () => {
		setDeviceFlowState(null);
	};

	const handleDeviceFlowStart = (provider: string) => {
		const providerName = provider === "github" ? "GitHub" : provider;
		setDeviceFlowState({ providerName });
		setStep("device-flow");
	};

	const handleDeviceFlowCancel = () => {
		setDeviceFlowState(null);
		setStep("auth-methods");
	};

	const renderStep = () => {
		if (deviceFlowState) {
			return (
				<DeviceFlowStep
					providerName={deviceFlowState.providerName}
					onAuthenticated={handleAuthenticated}
					onCancel={handleDeviceFlowCancel}
				/>
			);
		}

		if (!baseUrl) {
			return <BaseUrlStep onNext={handleBaseUrlNext} />;
		}

		return (
			<AuthMethodsStep
				onAuthenticated={handleAuthenticated}
				onDeviceFlowStart={handleDeviceFlowStart}
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
