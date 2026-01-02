import {
	createContext,
	type ReactNode,
	useContext,
	useId,
	useState,
} from "react";
import {
	Platform,
	TextInput,
	type TextInputProps,
	type TextProps,
	View,
	type ViewProps,
} from "react-native";

import { AppText } from "@/components/app-text";
import { useFontsConfig } from "@/lib/font-context";

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
		<AppText
			nativeID={labelId}
			// biome-ignore lint/nursery/useSortedClasses: Manual order for spec compliance
			className={`font-black uppercase tracking-widest text-black text-base ${
				isDisabled ? "opacity-50" : ""
			} ${className}`}
			{...props}
		>
			{children}
		</AppText>
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
	const { resolveFont } = useFontsConfig();
	const [isFocused, setIsFocused] = useState(false);

	const baseStyles =
		"h-12 w-full rounded-none border-4 border-black bg-white px-4 py-3 text-lg font-bold text-foreground placeholder:text-black/40";
	const focusStyles = isFocused ? "bg-surface-warningStrong neo-shadow-sm" : "";
	const invalidStyles = isInvalid
		? "border-black bg-surface-criticalStrong"
		: "";
	const disabledStyles = isDisabled ? "opacity-50 bg-input-disabled" : "";

	// Combine accessibility labels
	const accessibilityLabelledBy = [
		labelId,
		isInvalid ? errorMessageId : descriptionId,
	]
		.filter(Boolean)
		.join(" ");

	const fontFamily = resolveFont("sans", 400);

	return (
		<TextInput
			nativeID={inputId}
			accessibilityLabelledBy={accessibilityLabelledBy}
			editable={!isDisabled}
			className={`${baseStyles} ${focusStyles} ${invalidStyles} ${disabledStyles} ${className}`}
			placeholderTextColor="var(--text-weak)"
			style={[
				{ fontFamily },
				Platform.OS === "android" && { fontWeight: "400" },
				props.style,
			]}
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
		<AppText
			nativeID={descriptionId}
			className={`text-base text-black/70 ${className}`}
			{...props}
		>
			{children}
		</AppText>
	);
}

export interface ErrorMessageProps extends TextProps {
	children: ReactNode;
}

function ErrorMessage({ children, className, ...props }: ErrorMessageProps) {
	const { errorMessageId, isInvalid } = useTextFieldContext();

	if (!isInvalid) return null;

	return (
		<AppText
			nativeID={errorMessageId}
			// biome-ignore lint/nursery/useSortedClasses: Manual order for spec compliance
			className={`font-black uppercase text-surface-criticalStrong text-base ${className}`}
			{...props}
		>
			{children}
		</AppText>
	);
}

TextField.Label = Label;
TextField.Input = Input;
TextField.Description = Description;
TextField.ErrorMessage = ErrorMessage;
