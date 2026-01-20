import { ScrollView, Text, View } from "react-native";
import { useSessionList } from "@/lib/agent/agent-queries";
import { AgentCard } from "./AgentCard";

export interface MultiRunViewProps {
	workspaceId: string;
}

export function MultiRunView({ workspaceId }: MultiRunViewProps) {
	const { sessions, isLoading, isError } = useSessionList(workspaceId);

	const agentSessions = sessions.filter((s) => s.parentID);

	if (isLoading) {
		return (
			<View className="flex-1 items-center justify-center bg-background">
				<Text className="text-foreground-weak">Loading agents...</Text>
			</View>
		);
	}

	if (isError) {
		return (
			<View className="flex-1 items-center justify-center bg-background">
				<Text className="text-destructive">Failed to load agents</Text>
			</View>
		);
	}

	if (agentSessions.length === 0) {
		return (
			<View className="flex-1 items-center justify-center bg-background p-4">
				<Text className="center text-center text-foreground-weak">
					No agent sessions found. Agent sessions are created as subtasks from
					main sessions.
				</Text>
			</View>
		);
	}

	return (
		<ScrollView className="flex-1 bg-background">
			<View className="gap-4 p-4">
				<Text className="font-semibold text-foreground-strong">
					Agent Sessions ({agentSessions.length})
				</Text>

				{agentSessions.map((session) => (
					<AgentCard key={session.id} session={session} />
				))}
			</View>
		</ScrollView>
	);
}
