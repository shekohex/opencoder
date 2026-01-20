import { useState } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import type { Permission } from "@/domain/types";

export interface QuestionOption {
	label: string;
	description: string;
}

export interface Question {
	question: string;
	header: string;
	multiple?: boolean;
	options: QuestionOption[];
}

interface QuestionCardProps {
	question: Permission;
	questions: Question[];
	onRespond: (answers: string[][]) => void | Promise<void>;
	onReject: () => void | Promise<void>;
}

type Tab = "question" | "summary";

export function QuestionCard({
	questions,
	onRespond,
	onReject,
}: QuestionCardProps) {
	const [isResponding, setIsResponding] = useState(false);
	const [isVisible, setIsVisible] = useState(true);
	const [selectedOptions, setSelectedOptions] = useState<Set<number>>(
		new Set(),
	);
	const [currentTab, setCurrentTab] = useState<Tab>("question");

	const currentQuestionIndex = 0;
	const currentQuestion = questions[0];

	const handleOptionPress = (index: number) => {
		const newSelected = new Set(selectedOptions);

		if (currentQuestion?.multiple) {
			if (newSelected.has(index)) {
				newSelected.delete(index);
			} else {
				newSelected.add(index);
			}
		} else {
			newSelected.clear();
			newSelected.add(index);
		}

		setSelectedOptions(newSelected);
	};

	const handleConfirm = async () => {
		if (isResponding || selectedOptions.size === 0) return;

		setIsResponding(true);
		try {
			const answers = Array.from(selectedOptions).map((idx) => [
				currentQuestion?.options[idx]?.label ?? "",
			]);
			await onRespond(answers);
			setIsVisible(false);
		} finally {
			setIsResponding(false);
		}
	};

	const handleDismiss = async () => {
		if (isResponding) return;

		setIsResponding(true);
		try {
			await onReject();
			setIsVisible(false);
		} finally {
			setIsResponding(false);
		}
	};

	if (!isVisible || !currentQuestion) return null;

	const canConfirm = selectedOptions.size > 0;

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Input Needed</Text>
			<Text style={styles.questionText}>{currentQuestion.question}</Text>

			{questions.length > 1 && (
				<View style={styles.tabRow}>
					{questions.map((q, idx) => (
						<TouchableOpacity
							key={q.header}
							style={[
								styles.tab,
								currentTab === "question" &&
									currentQuestionIndex === idx &&
									styles.activeTab,
							]}
							onPress={() => setCurrentTab("question")}
						>
							<Text
								style={[
									styles.tabText,
									currentTab === "question" &&
										currentQuestionIndex === idx &&
										styles.activeTabText,
								]}
							>
								{q.header}
							</Text>
						</TouchableOpacity>
					))}
					<TouchableOpacity
						style={[styles.tab, currentTab === "summary" && styles.activeTab]}
						onPress={() => setCurrentTab("summary")}
					>
						<Text
							style={[
								styles.tabText,
								currentTab === "summary" && styles.activeTabText,
							]}
						>
							Summary
						</Text>
					</TouchableOpacity>
				</View>
			)}

			{currentTab === "question" ? (
				<ScrollView style={styles.optionsContainer}>
					{currentQuestion.multiple && (
						<Text style={styles.hintText}>Select multiple</Text>
					)}
					{currentQuestion.options.map((option, idx) => (
						<TouchableOpacity
							key={option.label}
							style={[
								styles.option,
								selectedOptions.has(idx) && styles.selectedOption,
							]}
							onPress={() => handleOptionPress(idx)}
						>
							<Text
								style={[
									styles.optionLabel,
									selectedOptions.has(idx) && styles.selectedOptionText,
								]}
							>
								{option.label}
							</Text>
							{option.description ? (
								<Text style={styles.optionDescription}>
									{option.description}
								</Text>
							) : null}
						</TouchableOpacity>
					))}
				</ScrollView>
			) : (
				<ScrollView style={styles.summaryContainer}>
					{questions.map((q, _qIdx) => {
						const selected = Array.from(selectedOptions).find(
							(i) => !!q.options[i],
						);
						const answer =
							selected !== undefined ? q.options[selected]?.label : null;

						return (
							<View key={q.question} style={styles.summaryItem}>
								<Text style={styles.summaryQuestion}>{q.question}</Text>
								<Text style={styles.summaryAnswer}>
									{answer ?? "(no answer)"}
								</Text>
							</View>
						);
					})}
				</ScrollView>
			)}

			<View style={styles.buttonRow}>
				<TouchableOpacity
					testID="dismiss-button"
					style={[styles.button, styles.dismissButton]}
					onPress={handleDismiss}
					disabled={isResponding}
				>
					<Text style={styles.buttonText}>Dismiss</Text>
				</TouchableOpacity>

				<TouchableOpacity
					testID="confirm-button"
					style={[
						styles.button,
						styles.confirmButton,
						!canConfirm && styles.disabledButton,
					]}
					onPress={handleConfirm}
					disabled={isResponding || !canConfirm}
				>
					<Text style={styles.buttonText}>Confirm</Text>
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
		marginBottom: 8,
	},
	questionText: {
		color: "#fff",
		fontSize: 14,
		marginBottom: 12,
	},
	tabRow: {
		flexDirection: "row",
		marginBottom: 12,
	},
	tab: {
		flex: 1,
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderBottomWidth: 2,
		borderColor: "#333",
		alignItems: "center",
	},
	activeTab: {
		borderColor: "#2563eb",
	},
	tabText: {
		color: "#888",
		fontSize: 12,
	},
	activeTabText: {
		color: "#2563eb",
		fontWeight: "600",
	},
	hintText: {
		color: "#888",
		fontSize: 12,
		marginBottom: 8,
	},
	optionsContainer: {
		maxHeight: 200,
		marginBottom: 12,
	},
	option: {
		backgroundColor: "#2a2a2a",
		borderColor: "#333",
		borderWidth: 1,
		borderRadius: 6,
		padding: 12,
		marginBottom: 8,
	},
	selectedOption: {
		backgroundColor: "#1e40af",
		borderColor: "#2563eb",
	},
	optionLabel: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "500",
	},
	selectedOptionText: {
		color: "#fff",
	},
	optionDescription: {
		color: "#888",
		fontSize: 12,
		marginTop: 4,
	},
	summaryContainer: {
		maxHeight: 200,
		marginBottom: 12,
	},
	summaryItem: {
		marginBottom: 12,
	},
	summaryQuestion: {
		color: "#888",
		fontSize: 12,
		marginBottom: 4,
	},
	summaryAnswer: {
		color: "#fff",
		fontSize: 14,
	},
	buttonRow: {
		flexDirection: "row",
		gap: 8,
	},
	button: {
		flex: 1,
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 6,
		alignItems: "center",
	},
	dismissButton: {
		backgroundColor: "#4b5563",
	},
	confirmButton: {
		backgroundColor: "#2563eb",
	},
	disabledButton: {
		opacity: 0.5,
	},
	buttonText: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "600",
	},
});
