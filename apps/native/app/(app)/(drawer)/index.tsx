import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Container } from "@/components/container";
import { useTheme } from "@/lib/theme-context";

export default function Home() {
	const { theme } = useTheme();

	return (
		<Container>
			<ScrollView style={styles.scrollView}>
				<View style={styles.content}>
					<Text style={[styles.title, { color: theme.navTheme.text }]}>
						BETTER T STACK
					</Text>

					<View
						style={[
							styles.card,
							{
								backgroundColor: theme.navTheme.card,
								borderColor: theme.navTheme.border,
							},
						]}
					/>
				</View>
			</ScrollView>
		</Container>
	);
}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
	},
	content: {
		padding: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 16,
	},
	card: {
		padding: 16,
		marginBottom: 16,
		borderWidth: 1,
	},
});
