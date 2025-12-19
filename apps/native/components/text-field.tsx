import {
	createContext,
	type ReactNode,
	useContext,
	useId,
	useState,
} from "react";
import {
	Text,
	TextInput,
	type TextInputProps,
	type TextProps,
	View,
	type ViewProps,
} from "react-native";

interface TextFieldContextValue {
	labelId: string;
	inputId: string;
	descriptionId: string;
	errorMessageId: string;
	isInvalid?: boolean;
	isDisabled?: boolean;
}

const TextFieldContext = createContext<TextFieldContextValue | null>(null);

function useTextFieldContext() {
	const context = useContext(TextFieldContext);
	if (!context) {
		throw new Error(
			"TextField compound components must be used within TextField",
		);
	}
	return context;
}

export interface TextFieldProps extends ViewProps {
	children: ReactNode;
	isInvalid?: boolean;
	isDisabled?: boolean;
}

export function TextField({
	children,
	isInvalid,
	isDisabled,
	className,
	...props
}: TextFieldProps) {
	const id = useId();
	const labelId = `${id}-label`;
	const inputId = `${id}-input`;
	const descriptionId = `${id}-description`;
	const errorMessageId = `${id}-error`;

	return (
		<TextFieldContext.Provider
			value={{
				labelId,
				inputId,
				descriptionId,
				errorMessageId,
				isInvalid,
				isDisabled,
			}}
		>
			<View className={`gap-2 ${className}`} {...props}>
				{children}
			</View>
		</TextFieldContext.Provider>
	);
}

export interface LabelProps extends TextProps {
	children: ReactNode;
}

function Label({ children, className, ...props }: LabelProps) {
	const { labelId, isDisabled } = useTextFieldContext();
	return (
		<Text
			nativeID={labelId}
			className={`font-medium text-foreground text-sm ${
				isDisabled ? "text-foreground-weak" : ""
			} ${className}`}
			{...props}
		>
			{children}
		</Text>
	);
}

export interface InputProps extends TextInputProps {
	className?: string;
}

function Input({ className, ...props }: InputProps) {
	const {
		inputId,
		labelId,
		descriptionId,
		errorMessageId,
		isInvalid,
		isDisabled,
	} = useTextFieldContext();
	const [isFocused, setIsFocused] = useState(false);

	const baseStyles =
		"h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-base text-foreground placeholder:text-foreground-weak focus:outline-none";
	const focusStyles = isFocused
		? "border-border-interactive ring-2 ring-border-interactive/20"
		: "";
	const invalidStyles = isInvalid
		? "border-border-critical text-foreground-critical bg-surface-critical"
		: "";
	const disabledStyles = isDisabled ? "opacity-50 bg-input-disabled" : "";

	// Combine accessibility labels
	const accessibilityLabelledBy = [
		labelId,
		isInvalid ? errorMessageId : descriptionId,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<TextInput
			nativeID={inputId}
			accessibilityLabelledBy={accessibilityLabelledBy}
			editable={!isDisabled}
			className={`${baseStyles} ${focusStyles} ${invalidStyles} ${disabledStyles} ${className}`}
			placeholderTextColor="var(--text-weak)"
			onFocus={(e) => {
				setIsFocused(true);
				props.onFocus?.(e);
			}}
			onBlur={(e) => {
				setIsFocused(false);
				props.onBlur?.(e);
			}}
			{...props}
		/>
	);
}

export interface DescriptionProps extends TextProps {
	children: ReactNode;
}

function Description({ children, className, ...props }: DescriptionProps) {
	const { descriptionId } = useTextFieldContext();
	return (
		<Text
			nativeID={descriptionId}
			className={`text-foreground-weak text-sm ${className}`}
			{...props}
		>
			{children}
		</Text>
	);
}

export interface ErrorMessageProps extends TextProps {
	children: ReactNode;
}

function ErrorMessage({ children, className, ...props }: ErrorMessageProps) {
	const { errorMessageId, isInvalid } = useTextFieldContext();

	if (!isInvalid) return null;

	return (
		<Text
			nativeID={errorMessageId}
			className={`font-medium text-foreground-critical text-sm ${className}`}
			{...props}
		>
			{children}
		</Text>
	);
}

TextField.Label = Label;
TextField.Input = Input;
TextField.Description = Description;
TextField.ErrorMessage = ErrorMessage;
