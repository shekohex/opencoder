export type ViewportSize = {
	name: string;
	width: number;
	height: number;
	category: "small" | "medium" | "tablet" | "large";
};

export type Breakpoint = "sm" | "md" | "lg" | "xl";

const KNOWN_VIEWPORTS: Record<string, ViewportSize> = {
	"375x667": { name: "iPhone SE", width: 375, height: 667, category: "small" },
	"390x844": {
		name: "iPhone 12/13/14",
		width: 390,
		height: 844,
		category: "medium",
	},
	"414x896": {
		name: "iPhone 14 Pro Max",
		width: 414,
		height: 896,
		category: "medium",
	},
};

export function detectViewportSize(
	width: number,
	height: number,
): ViewportSize {
	const key = `${width}x${height}`;
	if (KNOWN_VIEWPORTS[key]) {
		return KNOWN_VIEWPORTS[key];
	}

	let category: ViewportSize["category"] = "large";
	if (width < 500) category = "small";
	else if (width < 768) category = "medium";
	else if (width < 1024) category = "tablet";

	let name = "Desktop";
	if (category === "small") name = "Mobile Small";
	else if (category === "medium") name = "Mobile Medium";
	else if (category === "tablet") name = "Tablet";

	return { name, width, height, category };
}

export function getBreakpoint(width: number): Breakpoint {
	if (width < 385) return "sm";
	if (width < 768) return "md";
	if (width < 1280) return "lg";
	return "xl";
}

export function isMobileSize(width: number): boolean {
	return width < 500;
}
