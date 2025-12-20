import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Container } from "@/components/container";
import { useTheme } from "@/lib/theme-context";

export default function TabTwo() {
	const { theme } = useTheme();

	return (
		<Container>
			<ScrollView style={styles.scrollView}>
				<View style={styles.content}>
					<Text style={[styles.title, { color: theme.text.strong }]}>
						Tab Two
					</Text>
					<Text style={[styles.subtitle, { color: theme.text.weak }]}>
						Discover more features and content
					</Text>
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
