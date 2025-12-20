import { Tabs } from "expo-router";
import { TabBarIcon } from "@/components/tabbar-icon";
import { useTheme } from "@/lib/theme-context";

export default function TabLayout() {
	const { theme } = useTheme();
	const navColors = theme.navTheme;

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: navColors.primary,
				tabBarInactiveTintColor: navColors.text,
				tabBarStyle: {
					backgroundColor: navColors.background,
					borderTopColor: navColors.border,
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
				}}
			/>
			<Tabs.Screen
				name="two"
				options={{
					title: "Explore",
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="compass" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="tokens"
				options={{
					title: "Tokens",
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="paint-brush" color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
