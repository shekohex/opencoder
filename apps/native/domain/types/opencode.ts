import type {
	EventMessagePartUpdated,
	EventMessageUpdated,
	EventPermissionUpdated,
	EventPtyCreated,
	EventPtyUpdated,
	EventSessionCreated,
	EventSessionError,
	EventSessionStatus,
	EventSessionUpdated,
	EventTodoUpdated,
	FileDiff,
	FilePart,
	Message,
	Part,
	PatchPart,
	Permission,
	ReasoningPart,
	Session,
	SessionStatus,
	SnapshotPart,
	StepFinishPart,
	StepStartPart,
	TextPart,
	ToolPart,
} from "@opencode-ai/sdk";

export type {
	FilePart,
	Message,
	Part,
	Permission,
	Session,
	SessionStatus,
	TextPart,
	ToolPart,
	ReasoningPart,
	PatchPart,
	SnapshotPart,
	StepStartPart,
	StepFinishPart,
	EventMessageUpdated,
	EventMessagePartUpdated,
	EventPermissionUpdated,
	EventSessionCreated,
	EventSessionStatus,
	EventSessionUpdated,
	EventPtyCreated,
	EventPtyUpdated,
	EventTodoUpdated,
	EventSessionError,
	FileDiff,
};

export type { AssistantMessage, UserMessage } from "@opencode-ai/sdk";

export type MessageRole = Message["role"];

export type PartType = Part["type"];

export type PermissionType = "tool" | "file" | "command" | "http";

export type PermissionStatus = "pending" | "approved" | "denied";

export type MessageWithParts = Message & { parts: Part[] };

export type SessionWithMetadata = Session & {
	messages?: MessageWithParts[];
	permissions?: Permission[];
};
