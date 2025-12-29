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
	type GestureResponderEvent,
	Modal,
	Platform,
	Pressable,
	type StyleProp,
	Text,
	View,
	type ViewProps,
	type ViewStyle,
} from "react-native";
import Animated, {
	FadeIn,
	FadeOut,
	ZoomIn,
	ZoomOut,
} from "react-native-reanimated";

interface TriggerProps {
	onPress?: (e: GestureResponderEvent) => void;
}

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

interface DialogProps {
	children: React.ReactNode;
	isOpen?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (isOpen: boolean) => void;
	variant?: "sheet" | "alert";
}

export function Dialog({
	children,
	isOpen: controlledOpen,
	defaultOpen = false,
	onOpenChange,
	variant: _variant,
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

interface DialogTriggerProps {
	children: React.ReactElement;
	asChild?: boolean;
}

export function DialogTrigger({ children, asChild }: DialogTriggerProps) {
	const { onOpen } = useDialogContext();

	if (asChild && React.isValidElement(children)) {
		return React.cloneElement(children as React.ReactElement<TriggerProps>, {
			onPress: (e: GestureResponderEvent) => {
				(children as React.ReactElement<TriggerProps>).props.onPress?.(e);
				onOpen();
			},
		});
	}

	return <Pressable onPress={onOpen}>{children}</Pressable>;
}

interface DialogContentProps {
	children: React.ReactNode;
	className?: string;
	style?: StyleProp<ViewStyle>;
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
			shouldCloseOnBlur: false,
			shouldCloseOnInteractOutside: (_element) => {
				return false;
			},
		},
		ref as unknown as React.RefObject<HTMLElement>,
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
				<Pressable className="absolute inset-0" onPress={onClose} />
			</Animated.View>

			<View
				className="pointer-events-box-none flex-1 items-center justify-center p-4"
				pointerEvents="box-none"
			>
				<FocusScope contain restoreFocus autoFocus>
					<View
						ref={ref}
						{...(overlayProps as unknown as ViewProps)}
						style={{ maxWidth: "100%", maxHeight: "100%" }}
						onStartShouldSetResponder={() => true}
						{...(Platform.OS === "web"
							? {
									onPointerDown: (e: { stopPropagation: () => void }) =>
										e.stopPropagation(),
									onMouseDown: (e: { stopPropagation: () => void }) =>
										e.stopPropagation(),
									onClick: (e: { stopPropagation: () => void }) =>
										e.stopPropagation(),
								}
							: {})}
					>
						<Animated.View
							entering={ZoomIn.duration(200).springify().damping(20)}
							exiting={ZoomOut.duration(150)}
							className={`w-full max-w-sm rounded-xl border border-border bg-background shadow-xl ${className}`}
							style={style as StyleProp<ViewStyle>}
							accessibilityRole="none"
							aria-modal
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

export function DialogHeader({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return <View className={`p-6 pb-4 ${className}`}>{children}</View>;
}

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

export function DialogClose({
	className,
	asChild,
	children,
	style: _style,
}: {
	className?: string;
	asChild?: boolean;
	children?: React.ReactNode;
	style?: "default" | "cancel" | "destructive";
}) {
	const { onClose } = useDialogContext();

	if (asChild && React.isValidElement(children)) {
		return React.cloneElement(children as React.ReactElement<TriggerProps>, {
			onPress: (e: GestureResponderEvent) => {
				(children as React.ReactElement<TriggerProps>).props.onPress?.(e);
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
