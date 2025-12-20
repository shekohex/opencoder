import { StyleSheet, Text, View } from "react-native";
import { Container } from "@/components/container";
import { useTheme } from "@/lib/theme-context";

export default function Modal() {
	const { theme } = useTheme();

	return (
		<Container>
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={[styles.title, { color: theme.text.strong }]}>
						Modal
					</Text>
				</View>
			</View>
		</Container>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	header: {
		marginBottom: 16,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
});
