import { Feather } from "@expo/vector-icons";
import { FocusScope } from "@react-native-aria/focus";
import { useOverlay } from "@react-native-aria/overlays";
import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	Modal,
	Platform,
	Pressable,
	Text,
	View,
	type ViewStyle,
} from "react-native";
import Animated, {
	FadeIn,
	FadeOut,
	ZoomIn,
	ZoomOut,
} from "react-native-reanimated";

// --- Types & Context ---

interface DialogContextValue {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
	titleId?: string;
	descriptionId?: string;
	setTitleId: (id: string) => void;
	setDescriptionId: (id: string) => void;
}

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

function useDialogContext() {
	const context = useContext(DialogContext);
	if (!context) {
		throw new Error("Dialog compound components must be used within a Dialog");
	}
	return context;
}

// --- Components ---

interface DialogProps {
	children: React.ReactNode;
	isOpen?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (isOpen: boolean) => void;
}

export function Dialog({
	children,
	isOpen: controlledOpen,
	defaultOpen = false,
	onOpenChange,
}: DialogProps) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
	const isOpen = controlledOpen ?? uncontrolledOpen;
	const [titleId, setTitleId] = useState<string>();
	const [descriptionId, setDescriptionId] = useState<string>();

	const handleOpenChange = (open: boolean) => {
		if (controlledOpen === undefined) {
			setUncontrolledOpen(open);
		}
		onOpenChange?.(open);
	};

	return (
		<DialogContext.Provider
			value={{
				isOpen,
				onOpen: () => handleOpenChange(true),
				onClose: () => handleOpenChange(false),
				titleId,
				descriptionId,
				setTitleId,
				setDescriptionId,
			}}
		>
			{children}
		</DialogContext.Provider>
	);
}

// Trigger
interface DialogTriggerProps {
	children: React.ReactElement;
	asChild?: boolean;
}

export function DialogTrigger({ children, asChild }: DialogTriggerProps) {
	const { onOpen } = useDialogContext();

	if (asChild && React.isValidElement(children)) {
		return React.cloneElement(children as React.ReactElement<any>, {
			onPress: (e: any) => {
				(children as React.ReactElement<any>).props.onPress?.(e);
				onOpen();
			},
		});
	}

	return <Pressable onPress={onOpen}>{children}</Pressable>;
}

// Content (The Modal)
interface DialogContentProps {
	children: React.ReactNode;
	className?: string;
	style?: ViewStyle;
	overlayClassName?: string;
}

export function DialogContent({
	children,
	className,
	style,
	overlayClassName,
}: DialogContentProps) {
	const { isOpen, onClose, titleId, descriptionId } = useDialogContext();
	const ref = useRef<View>(null);

	const { overlayProps } = useOverlay(
		{
			isOpen,
			onClose,
			isDismissable: true,
			shouldCloseOnBlur: true,
			shouldCloseOnInteractOutside: (_element) => {
				// We handle backdrop clicks manually with the absolute Pressable below.
				// This avoids issues where clicks inside the dialog are interpreted as outside
				// if the ref isn't perfectly resolved (especially with Animated/Web views).
				// We keep isDismissable=true for Escape key support.
				return false;
			},
		},
		ref as any,
	);

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
				exiting={FadeOut.duration(200)}
				className={`absolute inset-0 bg-black/50 ${overlayClassName}`}
			>
				{/* Backdrop Pressable to close */}
				<Pressable className="absolute inset-0" onPress={onClose} />
			</Animated.View>

			<View
				className="pointer-events-box-none flex-1 items-center justify-center p-4"
				pointerEvents="box-none"
			>
				<FocusScope contain restoreFocus autoFocus>
					{/* Wrapper view to hold the ref for useOverlay compatibility */}
					<View
						ref={ref}
						// Use simple spread for props on Web, but filtering might be needed if conflicts arise.
						// React Native Web handles many aria attributes correctly.
						// @ts-expect-error - 'overlayProps' might have types incompatible with ViewProps but are valid on Web or filtered by RNW.
						{...overlayProps}
						style={{ maxWidth: "100%", maxHeight: "100%" }}
						// Using onStartShouldSetResponder to trap touches is a robust way to prevent
						// touches from bubbling to the backdrop Pressable in React Native.
						onStartShouldSetResponder={() => true}
					>
						<Animated.View
							entering={ZoomIn.duration(200).springify().damping(20)}
							exiting={ZoomOut.duration(150)}
							className={`w-full max-w-sm rounded-xl border border-border bg-background shadow-xl ${className}`}
							style={style as any}
							// @ts-expect-error
							accessibilityRole={Platform.OS === "web" ? "dialog" : "alert"}
							accessibilityModal
							aria-modal="true"
							aria-labelledby={titleId}
							aria-describedby={descriptionId}
						>
							{children}
						</Animated.View>
					</View>
				</FocusScope>
			</View>
		</Modal>
	);
}

// Header
export function DialogHeader({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return <View className={`p-6 pb-4 ${className}`}>{children}</View>;
}

// Title
export function DialogTitle({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	const { setTitleId } = useDialogContext();
	const id = React.useId();

	useEffect(() => {
		setTitleId(id);
		return () => setTitleId("");
	}, [id, setTitleId]);

	return (
		<Text
			nativeID={id}
			className={`font-semibold text-foreground text-lg leading-none tracking-tight ${className}`}
		>
			{children}
		</Text>
	);
}

// Description
export function DialogDescription({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	const { setDescriptionId } = useDialogContext();
	const id = React.useId();

	useEffect(() => {
		setDescriptionId(id);
		return () => setDescriptionId("");
	}, [id, setDescriptionId]);

	return (
		<Text
			nativeID={id}
			className={`mt-1.5 text-foreground-weak text-sm ${className}`}
		>
			{children}
		</Text>
	);
}

// Footer
export function DialogFooter({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<View className={`flex-row justify-end gap-2 p-6 pt-2 ${className}`}>
			{children}
		</View>
	);
}

// Close Button (Standard "X" icon usually top-right)
export function DialogClose({
	className,
	asChild,
	children,
}: {
	className?: string;
	asChild?: boolean;
	children?: React.ReactNode;
}) {
	const { onClose } = useDialogContext();

	if (asChild && React.isValidElement(children)) {
		return React.cloneElement(children as React.ReactElement<any>, {
			onPress: (e: any) => {
				(children as React.ReactElement<any>).props.onPress?.(e);
				onClose();
			},
		});
	}

	return (
		<Pressable
			onPress={onClose}
			className={`focus-ring absolute top-4 right-4 rounded-sm p-1 opacity-70 active:opacity-100 ${className}`}
			accessibilityRole="button"
			accessibilityLabel="Close"
		>
			{children || <Feather name="x" size={16} color="var(--color-icon)" />}
		</Pressable>
	);
}
