import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
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

import { useTheme } from "@/lib/theme-context";
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

interface InternalContextValue extends BottomSheetContextValue {
	bottomSheetRef: React.RefObject<BottomSheetModal | null>;
	snapPoints: string[];
}

const InternalContext = React.createContext<InternalContextValue | undefined>(
	undefined,
);

function useInternalContext() {
	const context = useContext(InternalContext);
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
		snapPoints || ["50%"],
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

	const publicValue = useMemo(
		() => ({
			isOpen,
			onOpen: () => handleOpenChange(true),
			onClose: () => handleOpenChange(false),
			snapPoints: internalSnapPoints,
			setSnapPoints: setInternalSnapPoints,
		}),
		[isOpen, internalSnapPoints, handleOpenChange],
	);

	const internalValue = useMemo(
		() => ({
			...publicValue,
			bottomSheetRef,
			handleSheetChanges,
		}),
		[publicValue, handleSheetChanges],
	);

	return (
		<NativeBottomSheetContext.Provider value={publicValue}>
			<InternalContext.Provider value={internalValue}>
				{children}
			</InternalContext.Provider>
		</NativeBottomSheetContext.Provider>
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
	const { bottomSheetRef, snapPoints, onClose } = useInternalContext();
	const { theme } = useTheme();

	const handleSheetChanges = useCallback(
		(index: number) => {
			if (index < 0) {
				onClose();
			}
		},
		[onClose],
	);

	const backdropComponent = useMemo(
		() =>
			function Backdrop() {
				return <View className="flex-1 bg-black/50" />;
			},
		[],
	);

	return (
		<BottomSheetModal
			ref={bottomSheetRef}
			snapPoints={snapPoints}
			onChange={handleSheetChanges}
			enablePanDownToClose
			backdropComponent={backdropComponent}
			backgroundStyle={{
				backgroundColor: "#ffffff",
				borderColor: "#000000",
				borderWidth: 4,
			}}
			handleIndicatorStyle={{
				backgroundColor: theme.surface.weak,
				borderColor: "#000000",
				borderWidth: 4,
				width: 40,
				height: 4,
				borderRadius: 4,
			}}
		>
			<BottomSheetView
				className={`p-6 ${className ?? ""}`}
				accessibilityViewIsModal
			>
				{children}
			</BottomSheetView>
		</BottomSheetModal>
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
