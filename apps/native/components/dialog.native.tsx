import React from "react";
import { Alert, type GestureResponderEvent, Pressable } from "react-native";

interface NativeDialogContextValue {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
	title: string;
	description: string;
	buttons: Array<{
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
	) => void;
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
}

export function Dialog({
	children,
	isOpen: controlledOpen,
	defaultOpen = false,
	onOpenChange,
}: DialogProps) {
	const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
	const isOpen = controlledOpen ?? uncontrolledOpen;
	const [title, setTitle] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [buttons, setButtons] = React.useState<
		NativeDialogContextValue["buttons"]
	>([]);

	const handleOpenChange = React.useCallback(
		(open: boolean) => {
			if (controlledOpen === undefined) {
				setUncontrolledOpen(open);
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
			setButtons((prev) => [...prev, { text, onPress, style }]);
		},
		[],
	);

	React.useEffect(() => {
		if (isOpen && title) {
			const alertButtons =
				buttons.length > 0
					? buttons.map((b) => ({
							text: b.text,
							onPress: () => {
								b.onPress();
								handleOpenChange(false);
							},
							style: b.style,
						}))
					: [{ text: "OK", onPress: () => handleOpenChange(false) }];

			Alert.alert(title, description || undefined, alertButtons, {
				cancelable: true,
			});
		}
	}, [isOpen, title, description, buttons, handleOpenChange]);

	return (
		<NativeDialogContext.Provider
			value={{
				isOpen,
				onOpen: () => handleOpenChange(true),
				onClose: () => handleOpenChange(false),
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

export function DialogContent({ children }: DialogContentProps) {
	return <>{children}</>;
}

interface DialogHeaderProps {
	children: React.ReactNode;
	className?: string;
}

export function DialogHeader({ children }: DialogHeaderProps) {
	return <>{children}</>;
}

interface DialogTitleProps {
	children: React.ReactNode;
	className?: string;
}

export function DialogTitle({ children }: DialogTitleProps) {
	const { setTitle } = useNativeDialogContext();
	React.useEffect(() => {
		setTitle(typeof children === "string" ? children : "");
	}, [children, setTitle]);
	return null;
}

interface DialogDescriptionProps {
	children: React.ReactNode;
	className?: string;
}

export function DialogDescription({ children }: DialogDescriptionProps) {
	const { setDescription } = useNativeDialogContext();
	React.useEffect(() => {
		setDescription(typeof children === "string" ? children : "");
	}, [children, setDescription]);
	return null;
}

interface DialogFooterProps {
	children: React.ReactNode;
	className?: string;
}

export function DialogFooter({ children }: DialogFooterProps) {
	return <>{children}</>;
}

interface DialogCloseProps {
	className?: string;
	asChild?: boolean;
	children?: React.ReactNode;
}

export function DialogClose({
	children,
	asChild,
	style: buttonStyle,
}: DialogCloseProps & { style?: "default" | "cancel" | "destructive" }) {
	const { addButton, onClose } = useNativeDialogContext();
	const text = typeof children === "string" ? children : "Cancel";

	React.useEffect(() => {
		addButton(text, onClose, buttonStyle || "cancel");
	}, [text, onClose, buttonStyle, addButton]);

	if (asChild && React.isValidElement(children)) {
		const childProps = children.props as Partial<TriggerProps>;
		return React.cloneElement(children, {
			onPress: (e: GestureResponderEvent) => {
				childProps.onPress?.(e);
				onClose();
			},
		} as Partial<TriggerProps>);
	}

	return <Pressable onPress={onClose}>{children}</Pressable>;
}

Dialog.Trigger = DialogTrigger;
Dialog.Content = DialogContent;
Dialog.Header = DialogHeader;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.Footer = DialogFooter;
Dialog.Close = DialogClose;
