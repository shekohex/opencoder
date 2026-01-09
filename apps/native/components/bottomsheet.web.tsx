import { Feather } from "@expo/vector-icons";
import React, { useCallback, useContext, useMemo, useState } from "react";
import {
	type GestureResponderEvent,
	Modal,
	Pressable,
	View,
} from "react-native";
import Animated, {
	FadeIn,
	FadeOut,
	SlideInDown,
	SlideOutDown,
} from "react-native-reanimated";

import type {
	BottomSheetCloseProps,
	BottomSheetContentProps,
	BottomSheetContextValue,
	BottomSheetProps,
	BottomSheetTriggerProps,
} from "./bottomsheet.shared";

const WebBottomSheetContext = React.createContext<
	BottomSheetContextValue | undefined
>(undefined);

function useWebBottomSheetContext() {
	const context = useContext(WebBottomSheetContext);
	if (!context) {
		throw new Error(
			"BottomSheet compound components must be used within a BottomSheet",
		);
	}
	return context;
}

export function BottomSheet({
	children,
	isOpen: controlledOpen,
	defaultOpen = false,
	onOpenChange,
	snapPoints,
}: BottomSheetProps) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
	const isOpen = controlledOpen ?? uncontrolledOpen;
	const [internalSnapPoints, setInternalSnapPoints] = useState<string[]>(
		snapPoints || ["90%"],
	);

	const handleOpenChange = useCallback(
		(open: boolean) => {
			if (controlledOpen === undefined) {
				setUncontrolledOpen(open);
			}
			onOpenChange?.(open);
		},
		[controlledOpen, onOpenChange],
	);

	const value = useMemo(
		() => ({
			isOpen,
			onOpen: () => handleOpenChange(true),
			onClose: () => handleOpenChange(false),
			snapPoints: internalSnapPoints,
			setSnapPoints: setInternalSnapPoints,
		}),
		[isOpen, internalSnapPoints, handleOpenChange],
	);

	return (
		<WebBottomSheetContext.Provider value={value}>
			{children}
		</WebBottomSheetContext.Provider>
	);
}

export function BottomSheetTrigger({
	children,
	asChild,
}: BottomSheetTriggerProps) {
	const { onOpen } = useWebBottomSheetContext();

	if (asChild && React.isValidElement(children)) {
		const childProps = children.props as Partial<{
			onPress?: (e: GestureResponderEvent) => void;
		}>;
		return React.cloneElement(children, {
			onPress: (e: GestureResponderEvent) => {
				childProps.onPress?.(e);
				onOpen();
			},
		} as Partial<{ onPress?: (e: GestureResponderEvent) => void }>);
	}

	return <Pressable onPress={onOpen}>{children}</Pressable>;
}

export function BottomSheetContent({
	children,
	className,
}: BottomSheetContentProps) {
	const { isOpen, onClose } = useWebBottomSheetContext();

	if (!isOpen) return null;

	return (
		<Modal
			transparent
			visible={isOpen}
			animationType="none"
			onRequestClose={onClose}
			statusBarTranslucent
		>
			<Animated.View
				entering={FadeIn.duration(200)}
				exiting={FadeOut.duration(150)}
				className="absolute inset-0 bg-black/50"
			>
				<Pressable
					className="absolute inset-0"
					onPress={onClose}
					accessibilityRole="none"
				/>
			</Animated.View>

			<View
				className="pointer-events-box-none flex-1 justify-end"
				style={{ pointerEvents: "box-none" }}
			>
				<Animated.View
					entering={SlideInDown.duration(250).springify().damping(20)}
					exiting={SlideOutDown.duration(200)}
					className={`rounded-t-2xl border-border border-t bg-background pb-8 ${className ?? ""}`}
				>
					<View className="items-center py-3">
						<View className="h-1 w-10 rounded-full bg-border" />
					</View>
					{children}
				</Animated.View>
			</View>
		</Modal>
	);
}

export function BottomSheetClose({ children, asChild }: BottomSheetCloseProps) {
	const { onClose } = useWebBottomSheetContext();

	if (asChild && React.isValidElement(children)) {
		const childProps = children.props as Partial<{
			onPress?: (e: GestureResponderEvent) => void;
		}>;
		return React.cloneElement(children, {
			onPress: (e: GestureResponderEvent) => {
				childProps.onPress?.(e);
				onClose();
			},
		} as Partial<{ onPress?: (e: GestureResponderEvent) => void }>);
	}

	return (
		<Pressable
			onPress={onClose}
			className="absolute top-4 right-4 rounded-sm p-1"
			accessibilityRole="button"
			accessibilityLabel="Close"
		>
			{children || <Feather name="x" size={20} />}
		</Pressable>
	);
}
