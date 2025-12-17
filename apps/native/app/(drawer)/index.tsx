import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	StyleSheet,
} from "react-native";
import { Container } from "@/components/container";
import { useColorScheme } from "@/lib/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";

export default function Home() {
	const { colorScheme } = useColorScheme();
	const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;

	return (
		<Container>
			<ScrollView style={styles.scrollView}>
				<View style={styles.content}>
					<Text style={[styles.title, { color: theme.text }]}>
						BETTER T STACK
					</Text>

					<View
						style={[
							styles.card,
							{ backgroundColor: theme.card, borderColor: theme.border },
						]}
					></View>
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
	statusRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	statusIndicator: {
		height: 8,
		width: 8,
	},
	statusContent: {
		flex: 1,
	},
	statusTitle: {
		fontSize: 14,
		fontWeight: "bold",
	},
	statusText: {
		fontSize: 12,
	},
	userCard: {
		marginBottom: 16,
		padding: 16,
		borderWidth: 1,
	},
	userHeader: {
		marginBottom: 8,
	},
	userText: {
		fontSize: 16,
	},
	userName: {
		fontWeight: "bold",
	},
	userEmail: {
		fontSize: 14,
		marginBottom: 12,
	},
	signOutButton: {
		padding: 12,
	},
	signOutText: {
		color: "#ffffff",
	},
	statusCard: {
		marginBottom: 16,
		padding: 16,
		borderWidth: 1,
	},
	statusCardTitle: {
		marginBottom: 8,
		fontWeight: "bold",
	},
});
