import type { Href } from "expo-router";
import { Link } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";

import { AppText } from "@/components/app-text";
import { Button } from "@/components/button";
import { Container } from "@/components/container";

const mockupRoutes = [
	{
		title: "Desktop",
		description: "Three-panel layout with right-side insights panel.",
		href: "/workspace-mockups/desktop",
	},
	{
		title: "Tablet",
		description: "Compact rails with chat focus and slim info panel.",
		href: "/workspace-mockups/tablet",
	},
	{
		title: "Mobile",
		description: "Stack navigation: Workspaces → Projects → Sessions → Chat.",
		href: "/workspace-mockups/mobile",
	},
];

export default function WorkspaceMockupsIndex() {
	return (
		<Container>
			<ScrollView
				className="flex-1 bg-background"
				contentContainerClassName="p-4"
			>
				<View className="gap-6">
					<View className="gap-2">
						<AppText className="font-bold text-foreground-strong text-xl">
							Workspace Mockups
						</AppText>
						<AppText className="text-foreground-weak text-sm">
							Navigate to the static mockups for desktop, tablet, and mobile.
						</AppText>
					</View>
					<View className="gap-3">
						{mockupRoutes.map((route) => (
							<Link key={route.title} href={route.href as Href} asChild>
								<Pressable className="gap-3 rounded-xl border border-border bg-surface px-4 py-4">
									<View className="gap-1">
										<AppText className="font-semibold text-foreground-strong text-lg">
											{route.title}
										</AppText>
										<AppText className="text-foreground-weak text-sm">
											{route.description}
										</AppText>
									</View>
									<Button size="sm" variant="outline">
										<AppText>Open {route.title}</AppText>
									</Button>
								</Pressable>
							</Link>
						))}
					</View>
				</View>
			</ScrollView>
		</Container>
	);
}
