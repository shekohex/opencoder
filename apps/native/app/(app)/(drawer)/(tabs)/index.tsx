import { Link } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { AppText } from "@/components/app-text";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { TabBarIcon } from "@/components/tabbar-icon";
import { useTheme } from "@/lib/theme-context";

export default function TabOne() {
	const { theme } = useTheme();

	return (
		<Container>
			<ScrollView style={styles.scrollView}>
				<View style={styles.content}>
					<View style={styles.titleRow}>
						<TabBarIcon name="home" color={theme.icon.base} />
						<AppText style={[styles.title, { color: theme.text.strong }]}>
							Home
						</AppText>
					</View>
					<AppText style={[styles.subtitle, { color: theme.text.weak }]}>
						Explore the first section of your app
					</AppText>

					<View className="mt-8">
						{/* @ts-ignore */}
						<Link href="/primitives" asChild>
							<Button>Go to Primitives Demo</Button>
						</Link>
					</View>
				</View>
			</ScrollView>
		</Container>
	);
}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
		padding: 16,
	},
	content: {
		paddingVertical: 16,
	},
	titleRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginBottom: 8,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
	},
});
