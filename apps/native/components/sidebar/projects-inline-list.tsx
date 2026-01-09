import { Ionicons } from "@expo/vector-icons";
import { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import { AppText } from "@/components/app-text";

const ITEMS_PER_PAGE = 10;

export type ProjectItem = {
	id: string;
	name: string;
	worktree?: string;
	isPinned?: boolean;
	isRecent?: boolean;
};

export function ProjectsInlineList({
	projects,
	selectedProjectId,
	onSelectProject,
	collapsed = false,
}: {
	projects: ProjectItem[];
	selectedProjectId?: string | null;
	onSelectProject?: (projectId: string, worktree?: string) => void;
	collapsed?: boolean;
}) {
	const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

	const sortedProjects = useMemo(() => {
		const pinned = projects.filter((p) => p.isPinned);
		const recent = projects.filter((p) => !p.isPinned && p.isRecent);
		const rest = projects.filter((p) => !p.isPinned && !p.isRecent);
		return [...pinned, ...recent, ...rest];
	}, [projects]);

	const displayedProjects = useMemo(
		() => sortedProjects.slice(0, visibleCount),
		[sortedProjects, visibleCount],
	);

	const hasMore = sortedProjects.length > visibleCount;

	const handleShowMore = useCallback(() => {
		setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
	}, []);

	if (collapsed) {
		return null;
	}

	return (
		<View className="pl-6">
			<FlatList
				data={displayedProjects}
				keyExtractor={(item) => item.id}
				scrollEnabled={false}
				renderItem={({ item }) => (
					<ProjectRow
						project={item}
						isSelected={item.id === selectedProjectId}
						onPress={() => onSelectProject?.(item.id, item.worktree)}
					/>
				)}
				ListFooterComponent={
					hasMore ? (
						<Pressable
							onPress={handleShowMore}
							className="flex-row items-center gap-2 px-3 py-2"
							accessibilityRole="button"
							accessibilityLabel={`Show ${Math.min(ITEMS_PER_PAGE, sortedProjects.length - visibleCount)} more projects`}
						>
							<Ionicons
								name="chevron-down"
								size={14}
								color="var(--color-icon)"
							/>
							<AppText className="text-foreground-weak text-xs">
								Show more ({sortedProjects.length - visibleCount} remaining)
							</AppText>
						</Pressable>
					) : null
				}
			/>
		</View>
	);
}

function ProjectRow({
	project,
	isSelected,
	onPress,
}: {
	project: ProjectItem;
	isSelected?: boolean;
	onPress?: () => void;
}) {
	return (
		<Pressable
			onPress={onPress}
			className={`flex-row items-center gap-2 rounded-lg px-3 py-2 ${
				isSelected ? "bg-surface" : "bg-transparent"
			}`}
			accessibilityRole="button"
			accessibilityState={{ selected: isSelected }}
		>
			{project.isPinned && (
				<Ionicons name="pin" size={12} color="var(--color-icon-interactive)" />
			)}
			<Ionicons name="folder-outline" size={14} color="var(--color-icon)" />
			<AppText
				className={`flex-1 text-sm ${isSelected ? "font-medium text-foreground-strong" : "text-foreground"}`}
				numberOfLines={1}
			>
				{project.name}
			</AppText>
		</Pressable>
	);
}
