import { Feather } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { Link } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, View } from "react-native";

import { AppText } from "@/components/app-text";
import { Button } from "@/components/button";
import { Container } from "@/components/container";

import { sessionRows } from "@/components/workspace-mockups/mock-data";
import { ROW_HEIGHTS } from "@/components/workspace-mockups/shared";
import { useWorkspaceNav } from "@/lib/workspace-nav";

const BACK_ROUTE = "/workspace-mockups/mobile/projects" as Href;
const NEXT_ROUTE = "/workspace-mockups/mobile/chat" as Href;

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

export default function WorkspaceMockupsMobileSessions() {
	const rowHeight = ROW_HEIGHTS.mobile;
	const [sessions, setSessions] = useState(sessionRows);
	const { selectedSessionId, setSelectedSessionId } = useWorkspaceNav();

	const handleCreateSession = () => {
		const nextSession = buildNewSession(sessions);
		setSessions((prev) => [...prev, nextSession]);
		setSelectedSessionId(nextSession.name);
	};

	return (
		<Container>
			<FlatList
				data={sessions}
				keyExtractor={(item) => item.name}
				className="flex-1 bg-background"
				contentContainerStyle={{ padding: 16 }}
				ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
				renderItem={({ item: session }) => {
					const isActive = session.name === selectedSessionId;

					return (
						<Link key={session.name} href={NEXT_ROUTE} asChild>
							<Pressable
								onPress={() => setSelectedSessionId(session.name)}
								className={`rounded-lg border px-3 ${
									isActive
										? "border-border-selected bg-surface"
										: "border-border bg-surface"
								}`}
								style={{ height: rowHeight }}
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
					);
				}}
				ListHeaderComponent={
					<View className="mb-4">
						<MobileHeader
							title="Sessions"
							backLabel="Projects"
							backHref={BACK_ROUTE}
							onNew={handleCreateSession}
						/>
					</View>
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
				<Pressable className="flex-row items-center gap-2">
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
