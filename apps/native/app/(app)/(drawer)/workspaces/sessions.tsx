import { Feather } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { Link } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";

import { AppText } from "@/components/app-text";
import { Button } from "@/components/button";
import { Container } from "@/components/container";

import { sessionRows } from "@/components/workspace-mockups/mock-data";
import { ROW_HEIGHTS } from "@/components/workspace-mockups/shared";

const BACK_ROUTE = "/workspaces/projects" as Href;
const NEXT_ROUTE = "/workspaces/chat" as Href;

export default function WorkspacesSessionsScreen() {
	const rowHeight = ROW_HEIGHTS.mobile;

	return (
		<Container>
			<ScrollView
				className="flex-1 bg-background"
				contentContainerClassName="p-4"
			>
				<View className="gap-4">
					<MobileHeader
						title="Sessions"
						backLabel="Projects"
						backHref={BACK_ROUTE}
					/>
					<View className="gap-2">
						{sessionRows.map((session, index) => (
							<Link key={session.name} href={NEXT_ROUTE} asChild>
								<Pressable
									className={`rounded-lg border px-3 ${
										index === 0
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
						))}
					</View>
					<Button size="sm" variant="outline">
						New session
					</Button>
				</View>
			</ScrollView>
		</Container>
	);
}

function MobileHeader({
	title,
	backLabel,
	backHref,
}: {
	title: string;
	backLabel: string;
	backHref: Href;
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
				<Button size="sm" variant="outline">
					New
				</Button>
			</View>
		</View>
	);
}
