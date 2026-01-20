import { useEffect, useRef } from "react";
import { FlatList, type ListRenderItemInfo, View } from "react-native";
import type { ChatMessageData } from "@/lib/chat/chat-queries";
import { ChatMessage } from "./ChatMessage";

export interface MessageListProps {
	messages: ChatMessageData[];
	isLoading?: boolean;
	autoScroll?: boolean;
}

export function MessageList({
	messages,
	isLoading = false,
	autoScroll = true,
}: MessageListProps) {
	const flatListRef = useRef<FlatList>(null);
	const lastMessageCount = useRef(messages.length);

	useEffect(() => {
		if (
			autoScroll &&
			flatListRef.current &&
			messages.length > lastMessageCount.current
		) {
			flatListRef.current.scrollToEnd({ animated: true });
		}
		lastMessageCount.current = messages.length;
	}, [messages.length, autoScroll]);

	const renderItem = (info: ListRenderItemInfo<ChatMessageData>) => {
		return <ChatMessage message={info.item} isMobile />;
	};

	const keyExtractor = (item: ChatMessageData) => item.id;

	const ListEmptyComponent = () => {
		if (isLoading) {
			return (
				<View className="flex-1 items-center justify-center p-8">
					<View className="text-foreground-weak text-sm">
						Loading messages...
					</View>
				</View>
			);
		}
		return (
			<View className="flex-1 items-center justify-center p-8">
				<View className="text-foreground-weak text-sm">No messages yet</View>
			</View>
		);
	};

	return (
		<FlatList
			ref={flatListRef}
			testID="message-list"
			data={messages}
			renderItem={renderItem}
			keyExtractor={keyExtractor}
			contentContainerClassName="gap-3 p-4"
			ListEmptyComponent={ListEmptyComponent}
			onContentSizeChange={() => {
				if (autoScroll && flatListRef.current) {
					flatListRef.current.scrollToEnd({ animated: true });
				}
			}}
		/>
	);
}
