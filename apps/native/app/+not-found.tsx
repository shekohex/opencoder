import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Container } from "@/components/container";
import { useTheme } from "@/lib/theme-context";

export default function NotFoundScreen() {
	const { theme } = useTheme();

	return (
		<>
			<Stack.Screen options={{ title: "Oops!" }} />
			<Container>
				<View style={styles.container}>
					<View style={styles.content}>
						<Text style={styles.emoji}>🤔</Text>
						<Text style={[styles.title, { color: theme.text.strong }]}>
							Page Not Found
						</Text>
						<Text style={[styles.subtitle, { color: theme.text.weak }]}>
							Sorry, the page you're looking for doesn't exist.
						</Text>
						<Link href="/" asChild>
							<Text
								style={[
									styles.link,
									{
										color: theme.text.interactive,
										backgroundColor: theme.surface.interactive,
									},
								]}
							>
								Go to Home
							</Text>
						</Link>
					</View>
				</View>
			</Container>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 16,
	},
	content: {
		alignItems: "center",
	},
	emoji: {
		fontSize: 48,
		marginBottom: 16,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 8,
		textAlign: "center",
	},
	subtitle: {
		fontSize: 14,
		textAlign: "center",
		marginBottom: 24,
	},
	link: {
		padding: 12,
	},
});
