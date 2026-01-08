import { Feather } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { Link } from "expo-router";
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
import {
	type SessionRowData,
	useCreateSession,
	useOpenCodeSessions,
} from "@/lib/session-queries";
import { useWorkspaceNav } from "@/lib/workspace-nav";

const BACK_ROUTE = "/workspaces/projects" as Href;
const NEXT_ROUTE = "/workspaces/chat" as Href;

export default function WorkspacesSessionsScreen() {
	const rowHeight = ROW_HEIGHTS.mobile;
	const {
		selectedWorkspaceId,
		selectedProjectWorktree,
		selectedSessionId,
		setSelectedSessionId,
	} = useWorkspaceNav();

	const { sessions, isLoading, isError, connectionStatus, refetch } =
		useOpenCodeSessions(
			selectedWorkspaceId,
			selectedProjectWorktree ?? undefined,
		);

	const createSession = useCreateSession(selectedWorkspaceId);

	const getListState = (): ListState => {
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
				contentContainerStyle={{ padding: 16 }}
				ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
				renderItem={({ item: session }) => (
					<SessionRow
						session={session}
						isSelected={selectedSessionId === session.id}
						onPress={() => setSelectedSessionId(session.id)}
						rowHeight={rowHeight}
					/>
				)}
				ListHeaderComponent={
					<View className="mb-4">
						<MobileHeader
							title="Sessions"
							backLabel="Projects"
							backHref={BACK_ROUTE}
							onNew={handleCreateSession}
							isCreating={createSession.isPending}
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
					resolvedListState === "loading" ? (
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
						<View className="mt-4">
							<Button
								size="sm"
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
}: {
	session: SessionRowData;
	isSelected: boolean;
	onPress: () => void;
	rowHeight: number;
}) {
	return (
		<Link href={NEXT_ROUTE} asChild>
			<Pressable
				onPress={onPress}
				className={`focus-ring rounded-xl border px-3 ${
					isSelected
						? "border-border-info bg-surface-info"
						: "border-border bg-surface"
				}`}
				style={{ height: rowHeight }}
				accessibilityRole="button"
				accessibilityLabel={`Open session ${session.name}`}
			>
				<View className="flex-row items-center justify-between">
					<AppText className="font-medium text-foreground-strong text-sm">
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
}: {
	title: string;
	backLabel: string;
	backHref: Href;
	onNew: () => void;
	isCreating?: boolean;
}) {
	return (
		<View className="gap-2">
			<Link href={backHref} asChild>
				<Pressable className="focus-ring flex-row items-center gap-2 rounded-full">
					<Feather name="chevron-left" size={14} color="var(--color-icon)" />
					<AppText className="text-foreground-weak text-xs">
						{backLabel}
					</AppText>
				</Pressable>
			</Link>
			<View className="flex-row items-center justify-between">
				<AppText className="font-semibold text-foreground-strong text-lg">
					{title}
				</AppText>
				<Button
					size="sm"
					variant="outline"
					onPress={onNew}
					disabled={isCreating}
				>
					{isCreating ? "..." : "New"}
				</Button>
			</View>
		</View>
	);
}
