import { ScrollView, Text, View } from "react-native";
import { useSessionTodo } from "@/lib/agent/agent-queries";

export interface TodoListProps {
	sessionId: string;
	compact?: boolean;
}

export function TodoList({ sessionId, compact = false }: TodoListProps) {
	const { todos, isLoading } = useSessionTodo(sessionId);

	const activeTodos = todos.filter(
		(t) => t.status === "pending" || t.status === "in_progress",
	);
	const completedTodos = todos.filter((t) => t.status === "completed");

	if (isLoading) {
		return (
			<View className="p-4">
				<Text className="text-foreground-weak">Loading...</Text>
			</View>
		);
	}

	if (todos.length === 0) {
		return null;
	}

	if (compact) {
		return (
			<View className="gap-2">
				{activeTodos.slice(0, 3).map((todo) => (
					<View key={todo.id} className="flex-row items-center gap-2">
						<View
							className={`h-2 w-2 rounded-full ${todo.status === "in_progress" ? "bg-primary" : "bg-foreground-weak/30"}`}
						/>
						<Text className="flex-1 text-foreground text-sm" numberOfLines={1}>
							{todo.content}
						</Text>
					</View>
				))}
				{activeTodos.length > 3 && (
					<Text className="text-foreground-weak text-xs">
						+{activeTodos.length - 3} more tasks
					</Text>
				)}
			</View>
		);
	}

	return (
		<ScrollView className="max-h-64">
			<View className="gap-2">
				{activeTodos.map((todo) => (
					<View
						key={todo.id}
						className={`flex-row items-start gap-2 rounded-lg p-2 ${todo.status === "in_progress" ? "bg-amber-500/10" : "bg-surface"}`}
					>
						<View
							className={`mt-1.5 h-2 w-2 rounded-full ${todo.status === "in_progress" ? "bg-primary" : "bg-foreground-weak/30"}`}
						/>
						<Text className="flex-1 text-foreground text-sm">
							{todo.content}
						</Text>
					</View>
				))}

				{completedTodos.length > 0 && (
					<>
						<View className="h-px bg-foreground-weak/10" />
						<Text className="font-semibold text-foreground-weak text-xs">
							Completed ({completedTodos.length})
						</Text>
						{completedTodos.slice(0, 5).map((todo) => (
							<View
								key={todo.id}
								className="flex-row items-start gap-2 opacity-50"
							>
								<View className="mt-1.5 h-2 w-2 rounded-full bg-green-500/50" />
								<Text
									className="flex-1 text-foreground text-sm line-through"
									numberOfLines={1}
								>
									{todo.content}
								</Text>
							</View>
						))}
					</>
				)}
			</View>
		</ScrollView>
	);
}
