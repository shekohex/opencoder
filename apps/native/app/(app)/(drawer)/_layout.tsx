import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { HeaderButton } from "@/components/header-button";
import { useTheme } from "@/lib/theme-context";

const DrawerLayout = () => {
	const { theme } = useTheme();
	const navColors = theme.navTheme;

	return (
		<Drawer
			screenOptions={{
				headerStyle: {
					backgroundColor: navColors.background,
				},
				headerTitleStyle: {
					color: navColors.text,
				},
				headerTintColor: navColors.text,
				drawerStyle: {
					backgroundColor: navColors.background,
				},
				drawerLabelStyle: {
					color: navColors.text,
				},
				drawerInactiveTintColor: navColors.text,
				drawerActiveTintColor: navColors.primary,
			}}
		>
			<Drawer.Screen
				name="index"
				options={{
					headerTitle: "Home",
					drawerLabel: "Home",
					drawerIcon: ({ size, color }) => (
						<Ionicons name="home-outline" size={size} color={color} />
					),
				}}
			/>
			<Drawer.Screen
				name="(tabs)"
				options={{
					headerTitle: "Tabs",
					drawerLabel: "Tabs",
					drawerIcon: ({ size, color }) => (
						<MaterialIcons name="border-bottom" size={size} color={color} />
					),
					headerRight: () => (
						<Link href="/modal" asChild>
							<HeaderButton />
						</Link>
					),
				}}
			/>
			<Drawer.Screen
				name="settings"
				options={{
					headerTitle: "Settings",
					drawerLabel: "Settings",
					drawerIcon: ({ size, color }) => (
						<Ionicons name="settings-outline" size={size} color={color} />
					),
				}}
			/>
		</Drawer>
	);
};

export default DrawerLayout;
