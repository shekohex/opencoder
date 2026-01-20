import { Feather } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { AppText } from "@/components/app-text";
import { Container } from "@/components/container";
import {
	useMcpConnect,
	useMcpDisconnect,
	useMcpStatus,
} from "@/lib/settings/settings-queries";

export default function McpSettingsScreen() {
	const { workspaceId } = useLocalSearchParams<{ workspaceId: string }>();
	const router = useRouter();
	const queryClient = useQueryClient();

	const { data: mcpStatus, isLoading } = useMcpStatus(workspaceId);
	const connectMutation = useMcpConnect();
	const disconnectMutation = useMcpDisconnect();

	const handleToggle = async (name: string, currentStatus: string) => {
		if (currentStatus === "connected") {
			await disconnectMutation.mutateAsync({ workspaceId, name });
		} else {
			await connectMutation.mutateAsync({ workspaceId, name });
		}
		await queryClient.invalidateQueries({
			queryKey: ["mcp-status", workspaceId],
		});
	};

	const mcpEntries = Object.entries(mcpStatus ?? {});
	const isBusy = connectMutation.isPending || disconnectMutation.isPending;

	return (
		<Container>
			<ScrollView className="flex-1 p-4">
				<View className="mb-4">
					<Pressable
						className="-ml-2 flex-row items-center gap-1 self-start rounded-full px-2 py-2"
						onPress={() => router.back()}
					>
						<Feather name="chevron-left" size={18} color="var(--color-icon)" />
						<AppText className="text-foreground-weak text-sm">Back</AppText>
					</Pressable>
				</View>

				<Text className="mb-6 font-bold text-2xl text-foreground-strong">
					MCP Servers
				</Text>

				{isLoading ? (
					<Text className="text-foreground-weak">Loading MCP servers...</Text>
				) : mcpEntries.length === 0 ? (
					<Text className="text-foreground-weak">
						No MCP servers configured
					</Text>
				) : (
					<View className="gap-2">
						{mcpEntries.map(([name, status]) => {
							const isConnected = status.status === "connected";
							const isDisabled = status.status === "disabled";
							const isError = !isConnected && !isDisabled;

							return (
								<McpItem
									key={name}
									name={name}
									status={
										isConnected ? "connected" : isError ? "error" : "disabled"
									}
									isBusy={isBusy}
									onToggle={() =>
										handleToggle(name, isConnected ? "connected" : "disabled")
									}
								/>
							);
						})}
					</View>
				)}

				<View className="h-8" />
			</ScrollView>
		</Container>
	);
}

function McpItem({
	name,
	status,
	isBusy,
	onToggle,
}: {
	name: string;
	status: "connected" | "disabled" | "error";
	isBusy: boolean;
	onToggle: () => void;
}) {
	const statusColors = {
		connected: "text-success",
		disabled: "text-foreground-weak",
		error: "text-destructive",
	};

	const statusText = {
		connected: "Connected",
		disabled: "Disabled",
		error: "Error",
	};

	const statusIcons = {
		connected: "check-circle" as const,
		disabled: "circle" as const,
		error: "alert-circle" as const,
	};

	return (
		<Pressable
			onPress={onToggle}
			disabled={isBusy}
			className={`flex-row items-center justify-between rounded-lg border border-border bg-background p-4 ${
				isBusy ? "opacity-50" : ""
			}`}
		>
			<View className="flex-1">
				<Text className="font-medium text-foreground">{name}</Text>
				<Text className={`text-sm ${statusColors[status]}`}>
					{statusText[status]}
				</Text>
			</View>
			<Feather
				name={statusIcons[status]}
				size={20}
				color={`var(--color-${status === "connected" ? "success" : status === "error" ? "destructive" : "icon-weak"})`}
			/>
		</Pressable>
	);
}
