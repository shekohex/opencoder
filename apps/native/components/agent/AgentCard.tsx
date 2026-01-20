import type { Session } from "@opencode-ai/sdk";
import { Pressable, Text, View } from "react-native";
import {
	useSessionChildren,
	useSessionStatus,
	useSessionTodo,
} from "@/lib/agent/agent-queries";

export interface AgentCardProps {
	session: Session;
	onPress?: (sessionId: string) => void;
}

export function AgentCard({ session, onPress }: AgentCardProps) {
	const { statusMap } = useSessionStatus(null);
	const { children } = useSessionChildren(session.id);
	const { todos } = useSessionTodo(session.id);

	const status = statusMap[session.id];
	const isBusy = status?.type === "busy";
	const isIdle = status?.type === "idle";

	const pendingTodos = todos.filter(
		(t) => t.status === "pending" || t.status === "in_progress",
	);
	const completedTodos = todos.filter((t) => t.status === "completed").length;

	return (
		<Pressable
			onPress={() => onPress?.(session.id)}
			className="rounded-xl border border-foreground-weak/10 bg-surface p-4"
		>
			<View className="gap-2">
				<View className="flex-row items-center justify-between">
					<Text
						className="font-semibold text-foreground-strong"
						numberOfLines={1}
					>
						{session.title}
					</Text>
					<View
						className={`rounded-full px-2 py-0.5 ${isBusy ? "bg-amber-500/20" : isIdle ? "bg-green-500/20" : "bg-foreground-weak/10"}`}
					>
						<Text
							className={`font-medium text-xs ${isBusy ? "text-amber-600" : isIdle ? "text-green-600" : "text-foreground-weak"}`}
						>
							{isBusy ? "Busy" : isIdle ? "Idle" : "Unknown"}
						</Text>
					</View>
				</View>

				{session.summary && (
					<Text className="text-foreground-weak text-sm">
						{session.summary.files} files changed
					</Text>
				)}

				<View className="flex-row gap-4">
					{children.length > 0 && (
						<Text className="text-foreground-weak text-sm">
							{children.length} child session{children.length !== 1 ? "s" : ""}
						</Text>
					)}

					{todos.length > 0 && (
						<Text className="text-foreground-weak text-sm">
							{completedTodos}/{todos.length} tasks
						</Text>
					)}
				</View>

				{pendingTodos.length > 0 && (
					<View className="gap-1">
						<Text className="font-semibold text-foreground-weak text-xs">
							In Progress
						</Text>
						{pendingTodos.slice(0, 3).map((todo) => (
							<View key={todo.id} className="flex-row items-center gap-2">
								<View
									className={`h-1.5 w-1.5 rounded-full ${todo.status === "in_progress" ? "bg-primary" : "bg-foreground-weak/30"}`}
								/>
								<Text className="text-foreground text-sm" numberOfLines={1}>
									{todo.content}
								</Text>
							</View>
						))}
						{pendingTodos.length > 3 && (
							<Text className="text-foreground-weak text-xs">
								+{pendingTodos.length - 3} more
							</Text>
						)}
					</View>
				)}
			</View>
		</Pressable>
	);
}
