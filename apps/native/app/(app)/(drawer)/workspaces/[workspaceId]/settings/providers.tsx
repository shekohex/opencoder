import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import { AppText } from "@/components/app-text";
import { Container } from "@/components/container";
import {
	useAvailableProviders,
	useProviders,
} from "@/lib/settings/settings-queries";

export default function ProvidersSettingsScreen() {
	const { workspaceId } = useLocalSearchParams<{ workspaceId: string }>();
	const router = useRouter();

	const { data: providers, isLoading: providersLoading } =
		useProviders(workspaceId);
	const { data: availableProviders, isLoading: availableLoading } =
		useAvailableProviders(workspaceId);

	const connectedIds = new Set(providers?.map((p) => p.id) ?? []);
	const unconnectedProviders = (availableProviders ?? []).filter(
		(p) => !connectedIds.has(p.id),
	);

	const isLoading = providersLoading || availableLoading;

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
					Providers
				</Text>

				{isLoading ? (
					<Text className="text-foreground-weak">Loading providers...</Text>
				) : (
					<View className="gap-4">
						{providers && providers.length > 0 && (
							<View>
								<Text className="mb-3 font-semibold text-foreground-strong text-lg">
									Connected
								</Text>
								<View className="gap-2">
									{providers.map((provider) => (
										<ProviderItem
											key={provider.id}
											provider={provider}
											connected
											onPress={() => {}}
										/>
									))}
								</View>
							</View>
						)}

						{unconnectedProviders.length > 0 && (
							<View>
								<Text className="mb-3 font-semibold text-foreground-strong text-lg">
									Available
								</Text>
								<View className="gap-2">
									{unconnectedProviders.map((provider) => (
										<ProviderItem
											key={provider.id}
											provider={{
												id: provider.id,
												name: provider.name ?? provider.id,
												models: [],
											}}
											connected={false}
											onPress={() => {}}
										/>
									))}
								</View>
							</View>
						)}

						{providers?.length === 0 && unconnectedProviders.length === 0 && (
							<Text className="text-foreground-weak">
								No providers available
							</Text>
						)}
					</View>
				)}

				<View className="h-8" />
			</ScrollView>
		</Container>
	);
}

function ProviderItem({
	provider,
	connected,
	onPress,
}: {
	provider: {
		id: string;
		name?: string;
		models?: unknown[] | Record<string, unknown>;
	};
	connected: boolean;
	onPress: () => void;
}) {
	const displayName = provider.name ?? provider.id;
	const modelCount = Array.isArray(provider.models)
		? provider.models.length
		: typeof provider.models === "object"
			? Object.keys(provider.models).length
			: 0;

	return (
		<Pressable
			onPress={onPress}
			className="flex-row items-center justify-between rounded-lg border border-border bg-background p-4"
		>
			<View className="flex-1">
				<Text className="font-medium text-foreground">{displayName}</Text>
				<Text className="text-foreground-weak text-sm">
					{provider.id}
					{modelCount > 0 && ` · ${modelCount} models`}
				</Text>
			</View>
			{connected ? (
				<Feather name="check-circle" size={20} color="var(--color-success)" />
			) : (
				<Feather name="plus-circle" size={20} color="var(--color-icon-weak)" />
			)}
		</Pressable>
	);
}
