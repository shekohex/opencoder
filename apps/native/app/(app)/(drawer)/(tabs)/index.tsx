import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { useTheme } from "@/lib/theme-context";

export default function TabOne() {
	const { theme } = useTheme();

	return (
		<Container>
			<ScrollView style={styles.scrollView}>
				<View style={styles.content}>
					<Text style={[styles.title, { color: theme.text.strong }]}>
						Tab One
					</Text>
					<Text style={[styles.subtitle, { color: theme.text.weak }]}>
						Explore the first section of your app
					</Text>

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
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
	},
});
