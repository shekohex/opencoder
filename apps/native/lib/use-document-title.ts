import { useEffect } from "react";
import { Platform } from "react-native";

const APP_NAME = "opencoder";

export type TitleSegments = {
	session?: string | null;
	project?: string | null;
	workspace?: string | null;
};

export function buildTitle(segments: TitleSegments): string {
	const parts: string[] = [];

	if (segments.session) {
		parts.push(segments.session);
	}
	if (segments.project) {
		parts.push(segments.project);
	}
	if (segments.workspace) {
		parts.push(segments.workspace);
	}

	if (parts.length === 0) {
		return `Workspaces | ${APP_NAME}`;
	}

	parts.push(APP_NAME);
	return parts.join(" | ");
}

export function useDocumentTitle(segments: TitleSegments) {
	useEffect(() => {
		if (Platform.OS !== "web") return;

		const title = buildTitle(segments);
		document.title = title;
	}, [segments.session, segments.project, segments.workspace, segments]);
}

export function setDocumentTitle(segments: TitleSegments) {
	if (Platform.OS !== "web") return;

	const title = buildTitle(segments);
	document.title = title;
}
