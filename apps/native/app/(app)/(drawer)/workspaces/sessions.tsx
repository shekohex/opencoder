import { Feather } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { Link, useRouter } from "expo-router";
import { useMemo } from "react";
import { FlatList, Pressable, View } from "react-native";

import { AppText } from "@/components/app-text";
import { Button } from "@/components/button";
import { Container } from "@/components/container";

import {
	EmptyStateCard,
	ErrorBanner,
	type ListState,
	LoadingList,
	ROW_HEIGHTS,
} from "@/components/workspace-mockups/shared";
import { useProjectName } from "@/lib/project-queries";
import {
	type SessionRowData,
	useCreateSession,
	useOpenCodeSessions,
} from "@/lib/session-queries";
import { useWorkspaceNav } from "@/lib/workspace-nav";
import { useWorkspaceName } from "@/lib/workspace-queries";
import { buildWorkspaceHref } from "@/lib/workspace-query-params";

export default function WorkspacesSessionsScreen() {
	const router = useRouter();
	const rowHeight = ROW_HEIGHTS.mobile;
	const {
		selectedWorkspaceId,
		selectedProjectId,
		selectedProjectWorktree,
		selectedSessionId,
		setSelectedSessionId,
	} = useWorkspaceNav();

	const {
		sessions,
		isLoading,
		isError,
		connectionStatus,
		refetch,
		hasDirectory,
	} = useOpenCodeSessions(
		selectedWorkspaceId,
		selectedProjectWorktree ?? undefined,
	);

	const createSession = useCreateSession(selectedWorkspaceId);
	const workspaceName = useWorkspaceName(selectedWorkspaceId);
	const projectName = useProjectName(selectedProjectWorktree);

	const backHref = useMemo(
		() =>
			buildWorkspaceHref("/workspaces/projects", {
				workspaceId: selectedWorkspaceId,
			}),
		[selectedWorkspaceId],
	);

	const handleGoToProjects = () => {
		router.push(backHref);
	};

	const buildSessionHref = (sessionId: string) =>
		buildWorkspaceHref("/workspaces/chat", {
			workspaceId: selectedWorkspaceId,
			projectId: selectedProjectId,
			worktree: selectedProjectWorktree,
			sessionId,
		});

	const getListState = (): ListState | "no-project" => {
		if (!hasDirectory) return "no-project";
		if (isLoading || connectionStatus === "connecting") return "loading";
		if (isError || connectionStatus === "error") return "error";
		if (sessions.length === 0) return "empty";
		return "ready";
	};

	const resolvedListState = getListState();

	const handleCreateSession = async () => {
		try {
			const newSession = await createSession.mutateAsync({
				directory: selectedProjectWorktree ?? undefined,
				title: undefined,
			});
			setSelectedSessionId(newSession.id);
		} catch {
			// error handled by mutation state
		}
	};

	const handleRetry = () => {
		refetch();
	};

	return (
		<Container>
			<FlatList
				testID="sessions-list"
				data={resolvedListState === "ready" ? sessions : []}
				keyExtractor={(item) => item.id}
				className="flex-1 bg-background"
				contentContainerStyle={{ padding: 20 }}
				ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
				renderItem={({ item: session }) => (
					<SessionRow
						session={session}
						isSelected={selectedSessionId === session.id}
						onPress={() => setSelectedSessionId(session.id)}
						rowHeight={rowHeight}
						href={buildSessionHref(session.id)}
					/>
				)}
				ListHeaderComponent={
					<View className="mb-4">
						<MobileHeader
							title={projectName ?? "Sessions"}
							backLabel={workspaceName ?? "Projects"}
							backHref={backHref}
							onNew={handleCreateSession}
							isCreating={createSession.isPending}
							isDisabled={!hasDirectory}
						/>
						{resolvedListState === "error" && (
							<View className="mt-3">
								<ErrorBanner
									title="Connection error"
									subtitle={
										connectionStatus === "error"
											? "Cannot connect to OpenCode server."
											: "Failed to load sessions."
									}
									ctaLabel="Retry"
									onPress={handleRetry}
								/>
							</View>
						)}
						{createSession.isError && (
							<View className="mt-3">
								<ErrorBanner
									title="Failed to create session"
									subtitle="Please try again."
									ctaLabel="Dismiss"
									onPress={() => createSession.reset()}
								/>
							</View>
						)}
					</View>
				}
				ListEmptyComponent={
					resolvedListState === "no-project" ? (
						<EmptyStateCard
							title="Please select a project"
							subtitle="Choose a project from the projects list to view its sessions."
							ctaLabel="Go to Projects"
							onPress={handleGoToProjects}
						/>
					) : resolvedListState === "loading" ? (
						<LoadingList count={5} rowHeight={rowHeight} />
					) : resolvedListState === "empty" ? (
						<EmptyStateCard
							title="No sessions yet"
							subtitle="Create a session to start chatting."
							ctaLabel="New session"
							onPress={handleCreateSession}
						/>
					) : null
				}
				ListFooterComponent={
					resolvedListState === "ready" && sessions.length > 0 ? (
						<View className="mt-6">
							<Button
								size="md"
								variant="outline"
								onPress={handleCreateSession}
								disabled={createSession.isPending}
							>
								{createSession.isPending ? "Creating..." : "New session"}
							</Button>
						</View>
					) : null
				}
			/>
		</Container>
	);
}

function SessionRow({
	session,
	isSelected,
	onPress,
	rowHeight,
	href,
}: {
	session: SessionRowData;
	isSelected: boolean;
	onPress: () => void;
	rowHeight: number;
	href: Href;
}) {
	return (
		<Link href={href} asChild>
			<Pressable
				onPress={onPress}
				className={`focus-ring justify-center rounded-2xl border px-4 ${
					isSelected
						? "border-border-info bg-surface-info"
						: "border-border bg-surface"
				}`}
				style={{ height: rowHeight }}
				accessibilityRole="button"
				accessibilityLabel={`Open session ${session.name}`}
			>
				<View className="flex-row items-center justify-between">
					<AppText className="font-medium text-base text-foreground-strong">
						{session.name}
					</AppText>
					<AppText className="text-foreground-weak text-xs">
						{session.status}
					</AppText>
				</View>
				<AppText className="text-foreground-weak text-xs">
					{session.lastUsed}
				</AppText>
			</Pressable>
		</Link>
	);
}

function MobileHeader({
	title,
	backLabel,
	backHref,
	onNew,
	isCreating,
	isDisabled,
}: {
	title: string;
	backLabel: string;
	backHref: Href;
	onNew: () => void;
	isCreating?: boolean;
	isDisabled?: boolean;
}) {
	return (
		<View className="gap-3">
			<Link href={backHref} asChild>
				<Pressable
					className="focus-ring -ml-2 flex-row items-center gap-1 rounded-full px-2 py-2"
					style={{ minWidth: 44, minHeight: 44 }}
				>
					<Feather name="chevron-left" size={18} color="var(--color-icon)" />
					<AppText className="text-foreground-weak text-sm">
						{backLabel}
					</AppText>
				</Pressable>
			</Link>
			<View className="flex-row items-center justify-between">
				<AppText className="font-semibold text-foreground-strong text-xl">
					{title}
				</AppText>
				<Button
					size="sm"
					variant="outline"
					onPress={onNew}
					disabled={isCreating || isDisabled}
				>
					{isCreating ? "..." : "New"}
				</Button>
			</View>
		</View>
	);
}
