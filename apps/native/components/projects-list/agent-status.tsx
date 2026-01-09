import { View } from "react-native";

import { AppText } from "@/components/app-text";
import { ErrorBanner } from "@/components/list-states";

export function AgentUnavailableInline() {
	return (
		<View className="ml-4 gap-1 border-border border-l pb-2 pl-4">
			<AppText className="text-foreground-critical text-xs">
				Agent unavailable
			</AppText>
			<AppText className="text-foreground-weak text-xs">
				Restart workspace to reconnect
			</AppText>
		</View>
	);
}

export interface AgentUnavailableBannerProps {
	onRetry?: () => void;
}

export function AgentUnavailableBanner({
	onRetry,
}: AgentUnavailableBannerProps) {
	return (
		<ErrorBanner
			title="Agent unavailable"
			subtitle="Workspace agent is disconnected. Try restarting the workspace."
			ctaLabel="Go back"
			onPress={onRetry}
		/>
	);
}
