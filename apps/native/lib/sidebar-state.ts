import { parseAsBoolean, useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { breakpoints } from "@/lib/tokens";

export const sidebarParamKeys = {
	workspacesCollapsed: "wsc",
	sessionsCollapsed: "ssc",
} as const;

export type SidebarCollapseState = {
	workspacesCollapsed: boolean;
	sessionsCollapsed: boolean;
};

export const SIDEBAR_COLLAPSED_WIDTH = 64;
export const SIDEBAR_EXPANDED_MIN_WIDTH = 260;
export const SIDEBAR_EXPANDED_MAX_WIDTH = 360;
export const SESSIONS_SIDEBAR_MIN_WIDTH = 200;
export const SESSIONS_SIDEBAR_MAX_WIDTH = 280;

function useBreakpointDefaults() {
	const { width } = useWindowDimensions();

	const isDesktop = width >= breakpoints.lg;
	const isTablet = width >= breakpoints.md && width < breakpoints.lg;
	const isMobile = width < breakpoints.md;

	const defaults = useMemo(
		() => ({
			workspacesCollapsed: isTablet,
			sessionsCollapsed: true,
		}),
		[isTablet],
	);

	return {
		isDesktop,
		isTablet,
		isMobile,
		defaults,
	};
}

export function useSidebarState() {
	const { isDesktop, isTablet, isMobile, defaults } = useBreakpointDefaults();

	const [workspacesCollapsedParam, setWorkspacesCollapsedParam] = useQueryState(
		sidebarParamKeys.workspacesCollapsed,
		parseAsBoolean,
	);

	const [sessionsCollapsedParam, setSessionsCollapsedParam] = useQueryState(
		sidebarParamKeys.sessionsCollapsed,
		parseAsBoolean,
	);

	const workspacesCollapsed =
		workspacesCollapsedParam ?? defaults.workspacesCollapsed;
	const sessionsCollapsed =
		sessionsCollapsedParam ?? defaults.sessionsCollapsed;

	const toggleWorkspacesSidebar = useCallback(() => {
		setWorkspacesCollapsedParam(!workspacesCollapsed);
	}, [workspacesCollapsed, setWorkspacesCollapsedParam]);

	const toggleSessionsSidebar = useCallback(() => {
		setSessionsCollapsedParam(!sessionsCollapsed);
	}, [sessionsCollapsed, setSessionsCollapsedParam]);

	const expandSessionsSidebar = useCallback(() => {
		if (sessionsCollapsed) {
			setSessionsCollapsedParam(false);
		}
	}, [sessionsCollapsed, setSessionsCollapsedParam]);

	const collapseSessionsSidebar = useCallback(() => {
		if (!sessionsCollapsed) {
			setSessionsCollapsedParam(true);
		}
	}, [sessionsCollapsed, setSessionsCollapsedParam]);

	return {
		isDesktop,
		isTablet,
		isMobile,
		workspacesCollapsed,
		sessionsCollapsed,
		toggleWorkspacesSidebar,
		toggleSessionsSidebar,
		expandSessionsSidebar,
		collapseSessionsSidebar,
		setWorkspacesCollapsed: setWorkspacesCollapsedParam,
		setSessionsCollapsed: setSessionsCollapsedParam,
	};
}
