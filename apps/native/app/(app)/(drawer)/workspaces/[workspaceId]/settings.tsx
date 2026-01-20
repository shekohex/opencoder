import { Feather } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import { AppText } from "@/components/app-text";
import { Container } from "@/components/container";

const _BACK_ROUTE = "/workspaces" as Href;

export default function WorkspaceSettingsScreen() {
	const { workspaceId } = useLocalSearchParams<{ workspaceId: string }>();
	const router = useRouter();

	return (
		<Container>
			<ScrollView className="flex-1 p-4">
				<View className="mb-4">
					<Link href={`/workspaces/${workspaceId}`} asChild>
						<Pressable className="-ml-2 flex-row items-center gap-1 self-start rounded-full px-2 py-2">
							<Feather
								name="chevron-left"
								size={18}
								color="var(--color-icon)"
							/>
							<AppText className="text-foreground-weak text-sm">Back</AppText>
						</Pressable>
					</Link>
				</View>

				<Text className="mb-6 font-bold text-2xl text-foreground-strong">
					Settings
				</Text>

				<View className="gap-3">
					<SettingsItem
						title="Providers"
						subtitle="Configure AI providers and models"
						icon="server"
						onPress={() =>
							router.push(
								`/workspaces/${workspaceId}/settings/providers` as Href,
							)
						}
					/>
					<SettingsItem
						title="MCP Servers"
						subtitle="Manage Model Context Protocol servers"
						icon="cpu"
						onPress={() =>
							router.push(`/workspaces/${workspaceId}/settings/mcp` as Href)
						}
					/>
				</View>

				<View className="h-8" />
			</ScrollView>
		</Container>
	);
}

function SettingsItem({
	title,
	subtitle,
	icon,
	onPress,
}: {
	title: string;
	subtitle: string;
	icon: keyof typeof Feather.glyphMap;
	onPress: () => void;
}) {
	return (
		<Pressable
			onPress={onPress}
			className="flex-row items-center gap-3 rounded-lg border border-border bg-background p-4"
		>
			<View className="h-10 w-10 items-center justify-center rounded-full bg-surface">
				<Feather name={icon} size={20} color="var(--color-icon)" />
			</View>
			<View className="flex-1">
				<Text className="font-medium text-foreground">{title}</Text>
				<Text className="text-foreground-weak text-sm">{subtitle}</Text>
			</View>
			<Feather name="chevron-right" size={16} color="var(--color-icon-weak)" />
		</Pressable>
	);
}
