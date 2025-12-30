import { useWindowDimensions } from "react-native";

type WorkspaceLayoutOptions = {
	padding?: number;
};

export function useWorkspaceLayout(options: WorkspaceLayoutOptions = {}) {
	const { padding = 0 } = options;
	const { width, height } = useWindowDimensions();

	const availableWidth = Math.max(width - padding * 2, 0);
	const availableHeight = Math.max(height - padding * 2, 0);
	const isPortrait = height >= width;

	return {
		width,
		height,
		availableWidth,
		availableHeight,
		isPortrait,
	};
}
