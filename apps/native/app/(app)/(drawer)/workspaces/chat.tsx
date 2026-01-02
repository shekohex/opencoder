import { Feather } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { Link } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";

import { AppText } from "@/components/app-text";
import { Button } from "@/components/button";
import { Container } from "@/components/container";

import {
	buildStatus,
	messageRows,
} from "@/components/workspace-mockups/mock-data";
import { useWorkspaceNav } from "@/lib/workspace-nav";

const BACK_ROUTE = "/workspaces/sessions" as Href;

export default function WorkspacesChatScreen() {
	const { setSelectedSessionId } = useWorkspaceNav();

	return (
		<Container>
			<View className="flex-1 bg-background">
				<View className="border-border border-b px-4 py-3">
					<Link href={BACK_ROUTE} asChild>
						<Pressable
							onPress={() => setSelectedSessionId("Workspace nav")}
							className="flex-row items-center gap-2"
						>
							<Feather
								name="chevron-left"
								size={14}
								color="var(--color-icon)"
							/>
							<AppText className="text-foreground-weak text-xs">
								Sessions
							</AppText>
						</Pressable>
					</Link>
					<View className="mt-2 flex-row items-center justify-between">
						<View>
							<AppText className="font-semibold text-foreground-strong text-lg">
								Chat
							</AppText>
							<AppText className="text-foreground-weak text-xs">
								Workspace nav session
							</AppText>
						</View>
						<Button size="sm" variant="outline">
							Share
						</Button>
					</View>
				</View>
				<ScrollView className="flex-1" contentContainerClassName="gap-3 p-4">
					<BuildBanner />
					{messageRows.map((message, index) => (
						<View
							key={`${message.role}-mobile-${index}`}
							className={`rounded-lg px-3 py-2 ${
								message.role === "user"
									? "self-end bg-surface-interactive"
									: "self-start bg-surface"
							}`}
							style={{ maxWidth: "85%" }}
						>
							<AppText className="text-foreground text-sm">
								{message.text}
							</AppText>
						</View>
					))}
				</ScrollView>
				<View className="border-border border-t bg-surface px-4 py-3">
					<View className="flex-row items-center gap-2 rounded-lg border border-border bg-input px-3 py-2">
						<AppText className="text-foreground-weak text-sm">
							Message...
						</AppText>
						<View className="ml-auto">
							<Feather name="send" size={14} color="var(--color-icon)" />
						</View>
					</View>
				</View>
			</View>
		</Container>
	);
}

function BuildBanner() {
	return (
		<View className="gap-1 rounded-lg border border-border-info bg-surface-info px-3 py-2">
			<View className="flex-row items-center justify-between">
				<View className="flex-row items-center gap-2">
					<View className="h-2 w-2 rounded-full bg-surface-info" />
					<AppText className="font-semibold text-foreground-strong text-xs">
						{buildStatus.title}
					</AppText>
				</View>
				<AppText className="text-foreground-weak text-xs">
					{buildStatus.detail}
				</AppText>
			</View>
			<AppText className="text-foreground-weak text-xs">
				{buildStatus.stage}
			</AppText>
		</View>
	);
}
