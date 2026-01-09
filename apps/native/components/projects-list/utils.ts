import type { ListState } from "@/components/workspace-mockups/shared";

export function isAgentUnhealthyError(error: unknown): boolean {
	return error != null && String(error).toLowerCase().includes("agent");
}

export function getProjectListState(
	isLoading: boolean,
	isError: boolean,
	hasProjects: boolean,
): ListState {
	if (isLoading) return "loading";
	if (isError) return "error";
	if (!hasProjects) return "empty";
	return "ready";
}
