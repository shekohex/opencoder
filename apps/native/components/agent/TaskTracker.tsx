import { ScrollView, Text, View } from "react-native";
import { useSessionTodo } from "@/lib/agent/agent-queries";

export interface TaskTrackerProps {
	sessionId: string;
}

export function TaskTracker({ sessionId }: TaskTrackerProps) {
	const { todos, isLoading } = useSessionTodo(sessionId);

	const pendingTodos = todos.filter((t) => t.status === "pending");
	const inProgressTodos = todos.filter((t) => t.status === "in_progress");
	const completedTodos = todos.filter((t) => t.status === "completed");
	const cancelledTodos = todos.filter((t) => t.status === "cancelled");

	const allCount = todos.length;
	const completedCount = completedTodos.length;
	const progress = allCount > 0 ? (completedCount / allCount) * 100 : 0;

	if (isLoading) {
		return (
			<View className="flex-1 items-center justify-center bg-background">
				<Text className="text-foreground-weak">Loading tasks...</Text>
			</View>
		);
	}

	if (todos.length === 0) {
		return (
			<View className="flex-1 items-center justify-center bg-background p-4">
				<Text className="center text-center text-foreground-weak">
					No tasks yet. Tasks will appear as the agent works.
				</Text>
			</View>
		);
	}

	return (
		<ScrollView className="flex-1 bg-background">
			<View className="gap-4 p-4">
				<View className="gap-2">
					<View className="flex-row items-center justify-between">
						<Text className="font-semibold text-foreground-strong">
							Task Progress
						</Text>
						<Text className="text-foreground-weak text-sm">
							{completedCount}/{allCount} ({Math.round(progress)}%)
						</Text>
					</View>

					<View className="h-2 overflow-hidden rounded-full bg-foreground-weak/10">
						<View
							className="h-full rounded-full bg-primary"
							style={{ width: `${progress}%` }}
						/>
					</View>
				</View>

				{inProgressTodos.length > 0 && (
					<View className="gap-2">
						<Text className="font-semibold text-foreground-strong">
							In Progress ({inProgressTodos.length})
						</Text>
						{inProgressTodos.map((todo) => (
							<View
								key={todo.id}
								className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3"
							>
								<Text className="text-foreground">{todo.content}</Text>
							</View>
						))}
					</View>
				)}

				{pendingTodos.length > 0 && (
					<View className="gap-2">
						<Text className="font-semibold text-foreground-strong">
							Pending ({pendingTodos.length})
						</Text>
						{pendingTodos.map((todo) => (
							<View
								key={todo.id}
								className="rounded-lg border border-foreground-weak/10 bg-surface p-3"
							>
								<Text className="text-foreground">{todo.content}</Text>
							</View>
						))}
					</View>
				)}

				{completedTodos.length > 0 && (
					<View className="gap-2">
						<Text className="font-semibold text-foreground-strong">
							Completed ({completedTodos.length})
						</Text>
						{completedTodos.map((todo) => (
							<View
								key={todo.id}
								className="rounded-lg border border-green-500/20 bg-surface p-3 opacity-60"
							>
								<Text className="text-foreground line-through">
									{todo.content}
								</Text>
							</View>
						))}
					</View>
				)}

				{cancelledTodos.length > 0 && (
					<View className="gap-2">
						<Text className="font-semibold text-foreground-strong">
							Cancelled ({cancelledTodos.length})
						</Text>
						{cancelledTodos.map((todo) => (
							<View
								key={todo.id}
								className="rounded-lg border border-destructive/20 bg-surface p-3 opacity-40"
							>
								<Text className="text-foreground line-through">
									{todo.content}
								</Text>
							</View>
						))}
					</View>
				)}
			</View>
		</ScrollView>
	);
}
