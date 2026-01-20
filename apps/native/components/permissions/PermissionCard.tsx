import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { Permission, PermissionType } from "@/domain/types";

type PermissionReply = "once" | "always" | "reject";

interface PermissionCardProps {
	permission: Permission;
	onResponse: (reply: PermissionReply) => void | Promise<void>;
}

export function PermissionCard({
	permission,
	onResponse,
}: PermissionCardProps) {
	const [isResponding, setIsResponding] = useState(false);
	const [isVisible, setIsVisible] = useState(true);

	const handleResponse = async (reply: PermissionReply) => {
		if (isResponding) return;

		setIsResponding(true);
		try {
			await onResponse(reply);
			setIsVisible(false);
		} finally {
			setIsResponding(false);
		}
	};

	const metadata = permission.metadata as Record<string, unknown>;
	const type = permission.type as PermissionType;

	if (!isVisible) {
		return null;
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Permission Required</Text>
			<Text style={styles.subtitle}>{permission.title}</Text>
			<Text style={styles.permissionType}>{type}</Text>

			{metadata.command ? (
				<>
					<Text style={styles.label}>Command:</Text>
					<Text style={styles.value}>{String(metadata.command)}</Text>
				</>
			) : null}

			{metadata.cwd ? (
				<>
					<Text style={styles.label}>Directory:</Text>
					<Text style={styles.value}>{String(metadata.cwd)}</Text>
				</>
			) : null}

			{metadata.path ? (
				<>
					<Text style={styles.label}>File:</Text>
					<Text style={styles.value}>{String(metadata.path)}</Text>
				</>
			) : null}

			{metadata.url ? (
				<>
					<Text style={styles.label}>URL:</Text>
					<Text style={styles.value}>{String(metadata.url)}</Text>
				</>
			) : null}

			{metadata.content ? (
				<>
					<Text style={styles.label}>Content:</Text>
					<Text style={styles.value}>{String(metadata.content)}</Text>
				</>
			) : null}

			{permission.pattern ? (
				<>
					<Text style={styles.label}>Pattern:</Text>
					<Text style={styles.value}>
						{Array.isArray(permission.pattern)
							? permission.pattern.join(", ")
							: String(permission.pattern)}
					</Text>
				</>
			) : null}

			<View style={styles.buttonRow}>
				<TouchableOpacity
					testID="allow-once-button"
					style={[styles.button, styles.allowOnceButton]}
					onPress={() => handleResponse("once")}
					disabled={isResponding}
				>
					<Text style={styles.buttonText}>Allow Once</Text>
				</TouchableOpacity>

				<TouchableOpacity
					testID="allow-always-button"
					style={[styles.button, styles.allowAlwaysButton]}
					onPress={() => handleResponse("always")}
					disabled={isResponding}
				>
					<Text style={styles.buttonText}>Always Allow</Text>
				</TouchableOpacity>

				<TouchableOpacity
					testID="deny-button"
					style={[styles.button, styles.denyButton]}
					onPress={() => handleResponse("reject")}
					disabled={isResponding}
				>
					<Text style={styles.buttonText}>Deny</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#1a1a1a",
		borderColor: "#333",
		borderWidth: 1,
		borderRadius: 8,
		padding: 16,
		marginBottom: 8,
	},
	title: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 4,
	},
	subtitle: {
		color: "#ccc",
		fontSize: 14,
		marginBottom: 8,
	},
	permissionType: {
		color: "#888",
		fontSize: 14,
		marginBottom: 12,
		textTransform: "uppercase",
	},
	label: {
		color: "#888",
		fontSize: 12,
		marginTop: 8,
		marginBottom: 4,
	},
	value: {
		color: "#fff",
		fontSize: 14,
		fontFamily: "monospace",
		marginBottom: 4,
	},
	buttonRow: {
		flexDirection: "row",
		gap: 8,
		marginTop: 16,
	},
	button: {
		flex: 1,
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 6,
		alignItems: "center",
	},
	allowOnceButton: {
		backgroundColor: "#2563eb",
	},
	allowAlwaysButton: {
		backgroundColor: "#16a34a",
	},
	denyButton: {
		backgroundColor: "#dc2626",
	},
	buttonText: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "600",
	},
});
