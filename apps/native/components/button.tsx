import { forwardRef, type ReactNode } from "react";
import {
	ActivityIndicator,
	Pressable,
	type PressableProps,
	Text,
	type View,
	type ViewStyle,
} from "react-native";

export type ButtonVariant =
	| "primary"
	| "secondary"
	| "ghost"
	| "danger"
	| "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<PressableProps, "style"> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	loading?: boolean;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	children?: ReactNode;
	className?: string;
	style?: ViewStyle;
}

const VARIANTS: Record<ButtonVariant, string> = {
	primary:
		"bg-surface-interactive hover:bg-surface-interactive-hover active:bg-surface-interactive-active border-transparent text-foreground-interactive",
	secondary:
		"bg-surface-weak hover:bg-surface-hover active:bg-surface-active border-transparent text-foreground",
	ghost:
		"bg-transparent hover:bg-surface-hover active:bg-surface-active border-transparent text-foreground",
	danger:
		"bg-surface-critical hover:bg-surface-critical/80 active:bg-surface-critical/60 border-transparent text-foreground-critical",
	outline:
		"bg-transparent border-border hover:bg-surface-hover active:bg-surface-active text-foreground",
};

const SIZES: Record<ButtonSize, string> = {
	sm: "h-8 px-3 rounded-md gap-2",
	md: "h-10 px-4 rounded-md gap-2",
	lg: "h-12 px-6 rounded-lg gap-3",
};

const TEXT_SIZES: Record<ButtonSize, string> = {
	sm: "text-sm",
	md: "text-base",
	lg: "text-lg",
};

export const Button = forwardRef<View, ButtonProps>(
	(
		{
			variant = "primary",
			size = "md",
			loading = false,
			leftIcon,
			rightIcon,
			children,
			className = "",
			disabled,
			...props
		},
		ref,
	) => {
		const baseStyles =
			"flex-row items-center justify-center border font-medium transition-colors focus-ring";
		const variantStyles = VARIANTS[variant];
		const sizeStyles = SIZES[size];
		const disabledStyles = disabled
			? "opacity-50 pointer-events-none bg-input-disabled text-foreground-weak"
			: "";

		const textBaseStyle = "font-medium text-center";
		const textSizeStyle = TEXT_SIZES[size];

		const getTextColorClass = () => {
			if (disabled) return "text-foreground-weak";
			switch (variant) {
				case "primary":
					return "text-foreground-interactive";
				case "danger":
					return "text-foreground-critical";
				default:
					return "text-foreground";
			}
		};

		return (
			<Pressable
				ref={ref}
				className={`${baseStyles} ${variantStyles} ${sizeStyles} ${disabledStyles} ${className}`}
				disabled={disabled || loading}
				accessibilityRole="button"
				accessibilityState={{ disabled: disabled || loading, busy: loading }}
				{...props}
			>
				{loading ? (
					<ActivityIndicator
						size="small"
						color="currentColor"
						className="mr-2"
					/>
				) : (
					leftIcon
				)}
				{typeof children === "string" ? (
					<Text
						className={`${textBaseStyle} ${textSizeStyle} ${getTextColorClass()}`}
					>
						{children}
					</Text>
				) : (
					children
				)}
				{!loading && rightIcon}
			</Pressable>
		);
	},
);

Button.displayName = "Button";
