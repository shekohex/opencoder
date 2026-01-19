import type {
	Event,
	EventCommandExecuted,
	EventFileEdited,
	EventFileWatcherUpdated,
	EventMessagePartUpdated,
	EventMessageUpdated,
	EventPermissionReplied,
	EventPermissionUpdated,
	EventPtyCreated,
	EventPtyDeleted,
	EventPtyExited,
	EventPtyUpdated,
	EventSessionCompacted,
	EventSessionCreated,
	EventSessionDeleted,
	EventSessionDiff,
	EventSessionError,
	EventSessionIdle,
	EventSessionStatus,
	EventSessionUpdated,
	EventTodoUpdated,
	EventVcsBranchUpdated,
} from "@opencode-ai/sdk";

export type {
	Event,
	EventMessageUpdated,
	EventMessagePartUpdated,
	EventPermissionUpdated,
	EventPermissionReplied,
	EventSessionCreated,
	EventSessionUpdated,
	EventSessionDeleted,
	EventSessionStatus,
	EventSessionIdle,
	EventSessionCompacted,
	EventSessionDiff,
	EventSessionError,
	EventFileEdited,
	EventTodoUpdated,
	EventCommandExecuted,
	EventPtyCreated,
	EventPtyUpdated,
	EventPtyExited,
	EventPtyDeleted,
	EventFileWatcherUpdated,
	EventVcsBranchUpdated,
};

export type EventType = Event["type"];

export type ChatEvent =
	| EventMessageUpdated
	| EventMessagePartUpdated
	| EventSessionCreated
	| EventSessionStatus
	| EventSessionError;

export type PermissionEvent = EventPermissionUpdated | EventPermissionReplied;

export type PtyEvent =
	| EventPtyCreated
	| EventPtyUpdated
	| EventPtyExited
	| EventPtyDeleted;

export type TodoEvent = EventTodoUpdated;

export type FileEvent = EventFileEdited | EventFileWatcherUpdated;

export type GitEvent = EventVcsBranchUpdated;
