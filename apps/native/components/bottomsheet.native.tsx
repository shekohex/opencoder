import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	type GestureResponderEvent,
	Pressable,
	Text,
	View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import type {
	BottomSheetCloseProps,
	BottomSheetContentProps,
	BottomSheetContextValue,
	BottomSheetProps,
	BottomSheetTriggerProps,
} from "./bottomsheet.shared";

const NativeBottomSheetContext = React.createContext<
	BottomSheetContextValue | undefined
>(undefined);

function useNativeBottomSheetContext() {
	const context = useContext(NativeBottomSheetContext);
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

	const bottomSheetRef = useRef<BottomSheetModal>(null);

	const handleOpenChange = useCallback(
		(open: boolean) => {
			if (controlledOpen === undefined) {
				setUncontrolledOpen(open);
			}
			onOpenChange?.(open);
		},
		[controlledOpen, onOpenChange],
	);

	const handleSheetChanges = useCallback(
		(index: number) => {
			const open = index >= 0;
			handleOpenChange(open);
		},
		[handleOpenChange],
	);

	useEffect(() => {
		if (isOpen) {
			bottomSheetRef.current?.present();
		} else {
			bottomSheetRef.current?.dismiss();
		}
	}, [isOpen]);

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
		<GestureHandlerRootView>
			<NativeBottomSheetContext.Provider value={value}>
				<BottomSheetModal
					ref={bottomSheetRef}
					index={isOpen ? 0 : -1}
					snapPoints={internalSnapPoints}
					onChange={handleSheetChanges}
					backgroundStyle={{ backgroundColor: "var(--color-background)" }}
					handleIndicatorStyle={{ backgroundColor: "var(--color-border)" }}
				>
					{children}
				</BottomSheetModal>
			</NativeBottomSheetContext.Provider>
		</GestureHandlerRootView>
	);
}

export function BottomSheetTrigger({
	children,
	asChild,
}: BottomSheetTriggerProps) {
	const { onOpen } = useNativeBottomSheetContext();

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
	const { onClose } = useNativeBottomSheetContext();

	return (
		<View className={`p-6 ${className ?? ""}`} onAccessibilityEscape={onClose}>
			{children}
		</View>
	);
}

export function BottomSheetClose({ children, asChild }: BottomSheetCloseProps) {
	const { onClose } = useNativeBottomSheetContext();

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
			className="rounded-sm p-1"
			accessibilityRole="button"
			accessibilityLabel="Close"
		>
			{children || <Text>✕</Text>}
		</Pressable>
	);
}
