import type {
	EventMessagePartUpdated,
	EventMessageUpdated,
} from "@opencode-ai/sdk";
import { useQueryClient } from "@tanstack/react-query";

import { useChatEvents } from "@/lib/opencode-provider";

export interface ChatContainerProps {
	workspaceId: string;
	sessionId: string;
}

export function ChatContainer(_props: ChatContainerProps) {
	const queryClient = useQueryClient();

	useChatEvents({
		onMessageUpdated: (_event: EventMessageUpdated) => {
			queryClient.invalidateQueries({
				queryKey: ["messages"],
			});
		},
		onMessagePartUpdated: (_event: EventMessagePartUpdated) => {
			queryClient.invalidateQueries({
				queryKey: ["messages"],
			});
		},
	});

	return null;
}
