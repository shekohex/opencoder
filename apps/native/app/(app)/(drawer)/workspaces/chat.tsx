import { Feather } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { Link, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";

import { AppText } from "@/components/app-text";
import { Button } from "@/components/button";
import { Container } from "@/components/container";

import { messageRows } from "@/components/workspace-mockups/mock-data";
import {
	EmptyStateCard,
	type ListState,
} from "@/components/workspace-mockups/shared";
import { useWorkspaceNav } from "@/lib/workspace-nav";

const BACK_ROUTE = "/workspaces/sessions" as Href;

export default function WorkspacesChatScreen() {
	const { selectedSessionId } = useWorkspaceNav();
	const { state } = useLocalSearchParams<{ state?: string }>();
	const messageState: ListState =
		state === "loading" || state === "error" || state === "empty"
			? state
			: "ready";
	const resolvedMessageState: ListState =
		messageState === "ready" && messageRows.length === 0
			? "empty"
			: messageState;

	return (
		<Container>
			<View className="flex-1 bg-background">
				<View className="border-border border-b px-4 py-3">
					<Link href={BACK_ROUTE} asChild>
						<Pressable className="focus-ring flex-row items-center gap-2 rounded-full">
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
						<AppText className="font-semibold text-foreground-strong text-lg">
							{selectedSessionId ?? "Session"}
						</AppText>
						<Button size="sm" variant="outline">
							Share
						</Button>
					</View>
				</View>
				<ScrollView className="flex-1" contentContainerClassName="gap-3 p-4">
					{resolvedMessageState === "loading" && (
						<View className="flex-1 items-center justify-center py-8">
							<ActivityIndicator color="var(--color-icon)" />
						</View>
					)}
					{resolvedMessageState === "empty" && (
						<EmptyStateCard
							title="No messages yet"
							subtitle="Start a session to see messages here."
							ctaLabel="New session"
						/>
					)}
					{resolvedMessageState === "ready" &&
						messageRows.map((message, index) => (
							<View
								key={`${message.role}-mobile-${index}`}
								className={`rounded-xl px-3 py-2 ${
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
					<View className="flex-row items-center gap-2 rounded-xl border border-border bg-input px-3 py-2">
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
