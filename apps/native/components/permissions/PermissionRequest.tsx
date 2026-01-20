import type { PermissionReply } from "@/lib/chat/permission-queries";
import {
	usePendingPermissions,
	usePendingQuestions,
	useRespondToPermission,
	useRespondToQuestion,
} from "@/lib/chat/permission-queries";
import { useWorkspaceSDK } from "@/lib/opencode-provider";
import { PermissionCard } from "./PermissionCard";
import { QuestionCard } from "./QuestionCard";

export interface PermissionRequestProps {
	sessionId: string;
}

export function PermissionRequest({ sessionId }: PermissionRequestProps) {
	const { client } = useWorkspaceSDK();
	const { permissions, isLoading: permissionsLoading } = usePendingPermissions(
		client,
		sessionId,
	);
	const { respondToPermission } = useRespondToPermission(client);
	const { questions, isLoading: questionsLoading } = usePendingQuestions(
		client,
		sessionId,
	);
	const { respondToQuestion } = useRespondToQuestion(client);

	if (
		(permissionsLoading && questionsLoading) ||
		(permissions.length === 0 && questions.length === 0)
	) {
		return null;
	}

	return (
		<>
			{permissions.map((permission) => (
				<PermissionCard
					key={permission.id}
					permission={permission}
					onResponse={async (reply: PermissionReply) => {
						await respondToPermission(sessionId, permission.id, reply);
					}}
				/>
			))}
			{questions.map((question) => (
				<QuestionCard
					key={question.id}
					question={question}
					questions={[
						{
							question: question.title,
							header: (question.metadata?.header as string) ?? "Question",
							multiple: (question.metadata?.multiple as boolean) ?? false,
							options:
								(question.metadata?.options as Array<{
									label: string;
									description: string;
								}>) ?? [],
						},
					]}
					onRespond={async (answers) => {
						await respondToQuestion(sessionId, question.id, answers);
					}}
					onReject={async () => {
						await respondToQuestion(sessionId, question.id, []);
					}}
				/>
			))}
		</>
	);
}
