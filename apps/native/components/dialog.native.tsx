import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React from "react";
import {
	Alert,
	type GestureResponderEvent,
	Pressable,
	Text,
	View,
} from "react-native";

import { useTheme } from "@/lib/theme-context";

interface NativeDialogContextValue {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
	variant: "sheet" | "alert";
	title: string;
	description: string;
	buttons: Array<{
		id: number;
		text: string;
		onPress: () => void;
		style?: "default" | "cancel" | "destructive";
	}>;
	setTitle: (title: string) => void;
	setDescription: (desc: string) => void;
	addButton: (
		text: string,
		onPress: () => void,
		style?: "default" | "cancel" | "destructive",
	) => () => void;
}

const NativeDialogContext = React.createContext<
	NativeDialogContextValue | undefined
>(undefined);

function useNativeDialogContext() {
	const context = React.useContext(NativeDialogContext);
	if (!context) {
		throw new Error("Dialog compound components must be used within a Dialog");
	}
	return context;
}

interface TriggerProps {
	onPress?: (e: GestureResponderEvent) => void;
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
	variant = "sheet",
}: DialogProps) {
	const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
	const isOpen = controlledOpen ?? uncontrolledOpen;
	const [title, setTitle] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [buttons, setButtons] = React.useState<
		NativeDialogContextValue["buttons"]
	>([]);
	const nextButtonId = React.useRef(0);
	const hasPresented = React.useRef(false);
	const openSession = React.useRef(0);
	const pendingFallback = React.useRef<ReturnType<typeof setTimeout> | null>(
		null,
	);

	const handleOpenChange = React.useCallback(
		(open: boolean) => {
			if (controlledOpen === undefined) {
				setUncontrolledOpen(open);
			}
			if (open) {
				hasPresented.current = false;
				openSession.current += 1;
				if (pendingFallback.current) {
					clearTimeout(pendingFallback.current);
					pendingFallback.current = null;
				}
			} else {
				hasPresented.current = false;
				if (pendingFallback.current) {
					clearTimeout(pendingFallback.current);
					pendingFallback.current = null;
				}
			}
			onOpenChange?.(open);
		},
		[controlledOpen, onOpenChange],
	);

	const handleAddButton = React.useCallback(
		(
			text: string,
			onPress: () => void,
			style?: "default" | "cancel" | "destructive",
		) => {
			const id = nextButtonId.current++;
			setButtons((prev) => [...prev, { id, text, onPress, style }]);
			return () =>
				setButtons((prev) => prev.filter((button) => button.id !== id));
		},
		[],
	);

	const handleOpen = React.useCallback(() => {
		handleOpenChange(true);
	}, [handleOpenChange]);

	const handleClose = React.useCallback(() => {
		handleOpenChange(false);
	}, [handleOpenChange]);

	React.useEffect(() => {
		if (variant !== "alert") return;
		if (!isOpen || !title || hasPresented.current) return;

		const showAlert = (
			alertButtons: Array<{
				text: string;
				onPress: () => void;
				style?: "default" | "cancel" | "destructive";
			}>,
		) => {
			if (!isOpen || hasPresented.current) return;
			hasPresented.current = true;
			Alert.alert(title, description || undefined, alertButtons, {
				cancelable: true,
				onDismiss: () => handleOpenChange(false),
			});
		};

		if (buttons.length > 0) {
			const mappedButtons = buttons.map((button) => ({
				text: button.text,
				onPress: () => {
					button.onPress();
					handleOpenChange(false);
				},
				style: button.style,
			}));
			const timeout = setTimeout(() => showAlert(mappedButtons), 0);
			return () => clearTimeout(timeout);
		}

		const session = openSession.current;
		pendingFallback.current = setTimeout(() => {
			if (!isOpen || hasPresented.current) return;
			if (openSession.current !== session) return;
			if (buttons.length > 0) return;
			showAlert([{ text: "OK", onPress: () => handleOpenChange(false) }]);
		}, 50);

		return () => {
			if (pendingFallback.current) {
				clearTimeout(pendingFallback.current);
				pendingFallback.current = null;
			}
		};
	}, [variant, isOpen, title, description, buttons, handleOpenChange]);

	return (
		<NativeDialogContext.Provider
			value={{
				isOpen,
				onOpen: handleOpen,
				onClose: handleClose,
				variant,
				title,
				description,
				buttons,
				setTitle,
				setDescription,
				addButton: handleAddButton,
			}}
		>
			{children}
		</NativeDialogContext.Provider>
	);
}

interface DialogTriggerProps {
	children: React.ReactElement;
	asChild?: boolean;
}

export function DialogTrigger({ children, asChild }: DialogTriggerProps) {
	const { onOpen } = useNativeDialogContext();

	if (asChild && React.isValidElement(children)) {
		const childProps = children.props as Partial<TriggerProps>;
		return React.cloneElement(children, {
			onPress: (e: GestureResponderEvent) => {
				childProps.onPress?.(e);
				onOpen();
			},
		} as Partial<TriggerProps>);
	}

	return <Pressable onPress={onOpen}>{children}</Pressable>;
}

interface DialogContentProps {
	children: React.ReactNode;
	className?: string;
	style?: Record<string, unknown>;
	overlayClassName?: string;
}

export function DialogContent({ children, className }: DialogContentProps) {
	const context = useNativeDialogContext();
	const { isOpen, onClose, variant } = context;
	const { theme } = useTheme();
	const sheetRef = React.useRef<BottomSheetModal>(null);

	React.useEffect(() => {
		if (variant !== "sheet") return;
		if (isOpen) {
			sheetRef.current?.present();
		} else {
			sheetRef.current?.dismiss();
		}
	}, [isOpen, variant]);

	const handleSheetChanges = React.useCallback(
		(index: number) => {
			if (index < 0) {
				onClose();
			}
		},
		[onClose],
	);

	if (variant === "alert") {
		return (
			<NativeDialogContext.Provider value={context}>
				<View
					style={{
						position: "absolute",
						width: 0,
						height: 0,
						opacity: 0,
						pointerEvents: "none",
					}}
				>
					{children}
				</View>
			</NativeDialogContext.Provider>
		);
	}

	return (
		<BottomSheetModal
			ref={sheetRef}
			snapPoints={["70%"]}
			onChange={handleSheetChanges}
			enablePanDownToClose
			backgroundStyle={{ backgroundColor: theme.background.base }}
			handleIndicatorStyle={{ backgroundColor: theme.border.base }}
		>
			<NativeDialogContext.Provider value={context}>
				<BottomSheetView className={`p-6 ${className ?? ""}`}>
					{children}
				</BottomSheetView>
			</NativeDialogContext.Provider>
		</BottomSheetModal>
	);
}

interface DialogHeaderProps {
	children: React.ReactNode;
	className?: string;
}

export function DialogHeader({ children, className }: DialogHeaderProps) {
	const { variant } = useNativeDialogContext();
	if (variant === "alert") return <>{children}</>;
	return <View className={`pb-4 ${className ?? ""}`}>{children}</View>;
}

interface DialogTitleProps {
	children: React.ReactNode;
	className?: string;
}

export function DialogTitle({ children, className }: DialogTitleProps) {
	const { isOpen, setTitle, variant } = useNativeDialogContext();
	React.useEffect(() => {
		if (variant !== "alert" || !isOpen) return;
		setTitle(typeof children === "string" ? children : "");
	}, [children, isOpen, setTitle, variant]);

	if (variant === "alert") return null;

	return (
		<Text
			className={`font-semibold text-foreground text-lg leading-none tracking-tight ${className ?? ""}`}
		>
			{children}
		</Text>
	);
}

interface DialogDescriptionProps {
	children: React.ReactNode;
	className?: string;
}

export function DialogDescription({
	children,
	className,
}: DialogDescriptionProps) {
	const { isOpen, setDescription, variant } = useNativeDialogContext();
	React.useEffect(() => {
		if (variant !== "alert" || !isOpen) return;
		setDescription(typeof children === "string" ? children : "");
	}, [children, isOpen, setDescription, variant]);

	if (variant === "alert") return null;

	return (
		<Text className={`mt-1.5 text-foreground-weak text-sm ${className ?? ""}`}>
			{children}
		</Text>
	);
}

interface DialogFooterProps {
	children: React.ReactNode;
	className?: string;
}

export function DialogFooter({ children, className }: DialogFooterProps) {
	const { variant } = useNativeDialogContext();
	if (variant === "alert") return <>{children}</>;
	return (
		<View className={`flex-row justify-end gap-2 pt-2 ${className ?? ""}`}>
			{children}
		</View>
	);
}

interface DialogCloseProps {
	className?: string;
	asChild?: boolean;
	children?: React.ReactNode;
	style?: "default" | "cancel" | "destructive";
}

function getButtonLabel(children: React.ReactNode) {
	if (typeof children === "string") return children;
	if (React.isValidElement(children)) {
		const child = children as React.ReactElement<{
			children?: React.ReactNode;
		}>;
		const childText = child.props.children;
		if (typeof childText === "string") return childText;
	}
	return "Cancel";
}

export function DialogClose({
	children,
	asChild,
	style: buttonStyle,
	className,
}: DialogCloseProps) {
	const { addButton, onClose, variant } = useNativeDialogContext();

	React.useEffect(() => {
		if (variant !== "alert") return;
		const text = getButtonLabel(children);
		const derivedStyle =
			buttonStyle ?? (text === "Cancel" ? "cancel" : "default");
		return addButton(text, onClose, derivedStyle);
	}, [children, onClose, buttonStyle, addButton, variant]);

	if (variant === "alert") return null;

	if (asChild && React.isValidElement(children)) {
		const childProps = children.props as Partial<TriggerProps>;
		return React.cloneElement(children, {
			onPress: (e: GestureResponderEvent) => {
				childProps.onPress?.(e);
				onClose();
			},
		} as Partial<TriggerProps>);
	}

	return (
		<Pressable
			onPress={onClose}
			className={className}
			accessibilityRole="button"
			accessibilityLabel="Close"
		>
			{children}
		</Pressable>
	);
}

Dialog.Trigger = DialogTrigger;
Dialog.Content = DialogContent;
Dialog.Header = DialogHeader;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.Footer = DialogFooter;
Dialog.Close = DialogClose;
