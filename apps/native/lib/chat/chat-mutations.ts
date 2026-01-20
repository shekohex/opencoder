import type { OpencodeClient } from "@opencode-ai/sdk";
import { useMutation } from "@tanstack/react-query";

import { useGlobalOpenCode } from "@/lib/opencode-provider";

interface SendMessageOptions {
	text: string;
	messageID?: string;
	model?: { providerID: string; modelID: string };
	agent?: string;
	noReply?: boolean;
	system?: string;
	tools?: Record<string, boolean>;
}

interface CreateSessionOptions {
	title?: string;
	parentID?: string;
}

export function useSendMessage(client: OpencodeClient, sessionId: string) {
	return useMutation({
		mutationFn: async (options: SendMessageOptions) => {
			if (!options.text || options.text.trim().length === 0) {
				throw new Error("Message text cannot be empty");
			}

			const result = await client.session.prompt({
				path: { id: sessionId },
				body: {
					parts: [{ type: "text", text: options.text }],
					messageID: options.messageID,
					model: options.model,
					agent: options.agent,
					noReply: options.noReply,
					system: options.system,
					tools: options.tools,
				},
			});

			return result.data;
		},
	});
}

export function useCreateSession(
	client: OpencodeClient,
	_workspaceId: string,
	directory: string,
) {
	return useMutation({
		mutationFn: async (options: CreateSessionOptions = {}) => {
			const result = await client.session.create({
				query: { directory },
				body: {
					title: options.title,
					parentID: options.parentID,
				},
			});

			return result.data;
		},
	});
}

export function useChatMutations(workspaceId: string, sessionId: string) {
	const { getClient } = useGlobalOpenCode();
	const client = getClient(workspaceId);

	if (!client) {
		throw new Error("No OpenCode client connected");
	}

	const sendMessage = useSendMessage(client, sessionId);
	const createSession = useCreateSession(client, workspaceId, sessionId);

	return {
		sendMessage,
		createSession,
	};
}
