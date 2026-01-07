import { Feather } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { Link, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, View } from "react-native";

import { AppText } from "@/components/app-text";
import { Button } from "@/components/button";
import { Container } from "@/components/container";

import { sessionRows } from "@/components/workspace-mockups/mock-data";
import {
	EmptyStateCard,
	ErrorBanner,
	type ListState,
	LoadingList,
	ROW_HEIGHTS,
} from "@/components/workspace-mockups/shared";
import { useWorkspaceNav } from "@/lib/workspace-nav";

const BACK_ROUTE = "/workspaces/projects" as Href;
const NEXT_ROUTE = "/workspaces/chat" as Href;

type SessionRowData = (typeof sessionRows)[number];

function buildNewSession(sessions: SessionRowData[]) {
	const existingNames = new Set(sessions.map((session) => session.name));
	let index = 1;
	let name = "New session";

	while (existingNames.has(name)) {
		index += 1;
		name = `New session ${index}`;
	}

	return {
		name,
		status: "New",
		lastUsed: "just now",
	};
}

export default function WorkspacesSessionsScreen() {
	const rowHeight = ROW_HEIGHTS.mobile;
	const [sessions, setSessions] = useState(sessionRows);
	const { selectedSessionId, setSelectedSessionId } = useWorkspaceNav();
	const { state } = useLocalSearchParams<{ state?: string }>();
	const listState: ListState =
		state === "loading" || state === "error" || state === "empty"
			? state
			: "ready";
	const resolvedListState: ListState =
		listState === "ready" && sessions.length === 0 ? "empty" : listState;

	const handleCreateSession = () => {
		const nextSession = buildNewSession(sessions);
		setSessions((prev) => [...prev, nextSession]);
		setSelectedSessionId(nextSession.name);
	};

	return (
		<Container>
			<FlatList
				testID="sessions-list"
				data={resolvedListState === "ready" ? sessions : []}
				keyExtractor={(item) => item.name}
				className="flex-1 bg-background"
				contentContainerStyle={{ padding: 16 }}
				ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
				renderItem={({ item: session }) => (
					<Link key={session.name} href={NEXT_ROUTE} asChild>
						<Pressable
							onPress={() => setSelectedSessionId(session.name)}
							className={`focus-ring rounded-xl border px-3 ${
								selectedSessionId === session.name
									? "border-border-info bg-surface-info"
									: "border-border bg-surface"
							}`}
							style={{ height: rowHeight }}
							accessibilityRole="button"
							accessibilityLabel={`Open session ${session.name}`}
						>
							<View className="flex-row items-center justify-between">
								<AppText className="font-medium text-foreground-strong text-sm">
									{session.name}
								</AppText>
								<AppText className="text-foreground-weak text-xs">
									{session.status}
								</AppText>
							</View>
							<AppText className="text-foreground-weak text-xs">
								Last used {session.lastUsed}
							</AppText>
						</Pressable>
					</Link>
				)}
				ListHeaderComponent={
					<View className="mb-4">
						<MobileHeader
							title="Sessions"
							backLabel="Projects"
							backHref={BACK_ROUTE}
							onNew={handleCreateSession}
						/>
						{resolvedListState === "error" && (
							<View className="mt-3">
								<ErrorBanner
									title="Server offline"
									subtitle="Open Code server is unreachable."
									ctaLabel="Retry"
								/>
							</View>
						)}
					</View>
				}
				ListEmptyComponent={
					resolvedListState === "loading" ? (
						<LoadingList count={5} rowHeight={rowHeight} />
					) : resolvedListState === "empty" ? (
						<EmptyStateCard
							title="No sessions yet"
							subtitle="Create a session to start chatting."
							ctaLabel="New session"
							onPress={handleCreateSession}
						/>
					) : null
				}
				ListFooterComponent={
					<View className="mt-4">
						<Button size="sm" variant="outline" onPress={handleCreateSession}>
							New session
						</Button>
					</View>
				}
			/>
		</Container>
	);
}

function MobileHeader({
	title,
	backLabel,
	backHref,
	onNew,
}: {
	title: string;
	backLabel: string;
	backHref: Href;
	onNew: () => void;
}) {
	return (
		<View className="gap-2">
			<Link href={backHref} asChild>
				<Pressable className="focus-ring flex-row items-center gap-2 rounded-full">
					<Feather name="chevron-left" size={14} color="var(--color-icon)" />
					<AppText className="text-foreground-weak text-xs">
						{backLabel}
					</AppText>
				</Pressable>
			</Link>
			<View className="flex-row items-center justify-between">
				<AppText className="font-semibold text-foreground-strong text-lg">
					{title}
				</AppText>
				<Button size="sm" variant="outline" onPress={onNew}>
					New
				</Button>
			</View>
		</View>
	);
}
