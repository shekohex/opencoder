import { useEffect } from "react";
import { useSharedValue } from "react-native-reanimated";
import { storage } from "./storage";

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const MIDDLE_WIDTH_KEY = "middle-width";

type BreakpointName = "desktop" | "tablet";

const DEFAULT_WIDTHS: Record<
	BreakpointName,
	{ sidebar: number; middle: number }
> = {
	desktop: { sidebar: 360, middle: 260 },
	tablet: { sidebar: 320, middle: 220 },
};

export function useSidebarWidths(breakpoint: BreakpointName) {
	const defaults = DEFAULT_WIDTHS[breakpoint];
	const savedSidebar = storage.getNumber(`${SIDEBAR_WIDTH_KEY}-${breakpoint}`);
	const savedMiddle = storage.getNumber(`${MIDDLE_WIDTH_KEY}-${breakpoint}`);

	const sidebarWidth = useSharedValue(savedSidebar ?? defaults.sidebar);
	const middleWidth = useSharedValue(savedMiddle ?? defaults.middle);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			storage.set(`${SIDEBAR_WIDTH_KEY}-${breakpoint}`, sidebarWidth.value);
		}, 300);
		return () => clearTimeout(timeoutId);
	}, [sidebarWidth.value, breakpoint]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			storage.set(`${MIDDLE_WIDTH_KEY}-${breakpoint}`, middleWidth.value);
		}, 300);
		return () => clearTimeout(timeoutId);
	}, [middleWidth.value, breakpoint]);

	return { sidebarWidth, middleWidth };
}
