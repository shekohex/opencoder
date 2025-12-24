import { View } from "react-native";
import { BaseUrlStep } from "@/components/auth/base-url-step";
import { Container } from "@/components/container";
import { useSession } from "@/lib/auth";

export default function SignIn() {
	const { baseUrl } = useSession();

	const handleBaseUrlNext = () => {
		// When base URL is set, the layout should handle redirection or we move to next step.
		// For now, we are building iteratively. Next task is auth methods.
		// If base URL is set, we show auth methods (next task).
		// But for now, let's just log it or do nothing as per plan "on submit, store base URL and trigger auth methods query"
		// The BaseUrlStep handles storing.
		console.log("Base URL set to:", baseUrl);
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
			{!baseUrl ? <BaseUrlStep onNext={handleBaseUrlNext} /> : <View />}
		</Container>
	);
}
