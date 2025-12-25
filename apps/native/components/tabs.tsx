import {
	createContext,
	type KeyboardEvent,
	type MutableRefObject,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	type AccessibilityRole,
	Platform,
	Pressable,
	type PressableProps,
	Text,
	View,
	type ViewProps,
} from "react-native";

// --- Types & Context ---

interface TabsContextValue {
	value: string;
	onValueChange: (value: string) => void;
	orientation: "horizontal" | "vertical";
	registerTrigger: (value: string, ref: View) => void;
	unregisterTrigger: (value: string) => void;
	triggers: MutableRefObject<Map<string, View>>;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
	const context = useContext(TabsContext);
	if (!context) {
		throw new Error("Tabs compound components must be used within a Tabs");
	}
	return context;
}

// --- Components ---

interface TabsProps extends ViewProps {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	orientation?: "horizontal" | "vertical";
}

export function Tabs({
	value: controlledValue,
	defaultValue,
	onValueChange,
	orientation = "horizontal",
	children,
	...props
}: TabsProps) {
	const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
	const value = controlledValue ?? uncontrolledValue;
	const triggersRef = useRef<Map<string, View>>(new Map());

	const handleValueChange = (newValue: string) => {
		if (controlledValue === undefined) {
			setUncontrolledValue(newValue);
		}
		onValueChange?.(newValue);
	};

	const registerTrigger = (val: string, ref: View) => {
		triggersRef.current.set(val, ref);
	};

	const unregisterTrigger = (val: string) => {
		triggersRef.current.delete(val);
	};

	return (
		<TabsContext.Provider
			value={{
				value: value ?? "",
				onValueChange: handleValueChange,
				orientation,
				registerTrigger,
				unregisterTrigger,
				triggers: triggersRef,
			}}
		>
			<View {...props}>{children}</View>
		</TabsContext.Provider>
	);
}

interface TabsListProps extends ViewProps {
	className?: string;
}

export function TabsList({ className, children, ...props }: TabsListProps) {
	return (
		<View
			accessibilityRole="tablist"
			className={`flex-row items-center justify-start rounded-lg bg-surface-weak p-1 ${className}`}
			{...props}
		>
			{children}
		</View>
	);
}

interface TabsTriggerProps extends PressableProps {
	value: string;
	className?: string;
	disabled?: boolean;
}

export function TabsTrigger({
	value,
	className,
	children,
	disabled,
	...props
}: TabsTriggerProps) {
	const {
		value: activeValue,
		onValueChange,
		registerTrigger,
		unregisterTrigger,
		triggers,
		orientation,
	} = useTabsContext();
	const ref = useRef<View>(null);
	const isActive = activeValue === value;

	useEffect(() => {
		if (ref.current) {
			registerTrigger(value, ref.current);
		}
		return () => unregisterTrigger(value);
	}, [value, registerTrigger, unregisterTrigger]);

	// Web Roving Focus Logic
	const handleKeyDown = (e: KeyboardEvent) => {
		if (Platform.OS !== "web") return;

		const triggerValues = Array.from(triggers.current.keys());
		const currentIndex = triggerValues.indexOf(value);
		const length = triggerValues.length;
		let nextIndex = currentIndex;

		// Handle keys based on orientation
		// Horizontal: Left/Right
		// Vertical: Up/Down
		// Both: Home/End
		const isHorizontal = orientation === "horizontal";
		const isVertical = orientation === "vertical";

		switch (e.key) {
			case "ArrowRight":
				if (isHorizontal) {
					nextIndex = (currentIndex + 1) % length;
					e.preventDefault();
				}
				break;
			case "ArrowLeft":
				if (isHorizontal) {
					nextIndex = (currentIndex - 1 + length) % length;
					e.preventDefault();
				}
				break;
			case "ArrowDown":
				if (isVertical) {
					nextIndex = (currentIndex + 1) % length;
					e.preventDefault();
				}
				break;
			case "ArrowUp":
				if (isVertical) {
					nextIndex = (currentIndex - 1 + length) % length;
					e.preventDefault();
				}
				break;
			case "Home":
				nextIndex = 0;
				e.preventDefault();
				break;
			case "End":
				nextIndex = length - 1;
				e.preventDefault();
				break;
			case "Enter":
			case " ":
				onValueChange(value);
				e.preventDefault();
				return;
		}

		if (nextIndex !== currentIndex) {
			const nextValue = triggerValues[nextIndex];
			const nextRef = triggers.current.get(nextValue);
			// Move focus
			if (nextRef) {
				// We force cast to 'any' to access the web-only 'focus' method on the View ref
				// in React Native Web. This is safe because we guard with Platform.OS === "web".
				// biome-ignore lint/suspicious/noExplicitAny: View has focus() on web
				(nextRef as any).focus();
			}
			// Auto-select
			onValueChange(nextValue);
		}
	};

	const baseStyles =
		"items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group";
	const activeContainerStyles = isActive
		? "bg-background shadow-sm"
		: "hover:bg-surface-hover";

	const textBaseStyles = "text-sm font-medium text-center";
	const activeTextStyles = isActive
		? "text-foreground-strong"
		: "text-foreground-weak group-hover:text-foreground-strong";

	return (
		<Pressable
			ref={ref}
			onPress={() => !disabled && onValueChange(value)}
			disabled={disabled}
			accessibilityRole="tab"
			accessibilityState={{ selected: isActive, disabled }}
			accessibilityLabel={typeof children === "string" ? children : undefined}
			className={`${baseStyles} ${activeContainerStyles} ${className}`}
			{...props}
			// @ts-expect-error: Web-only prop
			onKeyDown={handleKeyDown}
			tabIndex={isActive ? 0 : -1}
		>
			{typeof children === "string" ? (
				<Text className={`${textBaseStyles} ${activeTextStyles}`}>
					{children}
				</Text>
			) : (
				children
			)}
		</Pressable>
	);
}

interface TabsContentProps extends ViewProps {
	value: string;
	className?: string;
}

export function TabsContent({
	value,
	className,
	children,
	...props
}: TabsContentProps) {
	const { value: activeValue } = useTabsContext();

	if (activeValue !== value) return null;

	return (
		<View
			// We use 'as unknown as AccessibilityRole' to allow 'tabpanel' which is valid
			// on React Native Web but not yet in the React Native types.
			accessibilityRole={
				Platform.OS === "web"
					? ("tabpanel" as unknown as AccessibilityRole)
					: undefined
			}
			className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
			{...props}
		>
			{children}
		</View>
	);
}

Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;
