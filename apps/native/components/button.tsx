import { forwardRef, type ReactNode } from "react";
import {
	ActivityIndicator,
	Pressable,
	type PressableProps,
	Text,
	type View,
	type ViewStyle,
} from "react-native";
import { useTheme } from "@/lib/theme-context";
import { palette } from "@/lib/tokens";

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
		"bg-surface-brand border-black hover:bg-surface-brandHover active:bg-surface-brand",
	secondary:
		"bg-white border-black hover:bg-surface-hover active:bg-surface-active",
	ghost:
		"bg-transparent border-transparent hover:border-black hover:bg-surface-hover active:bg-surface-active",
	danger:
		"bg-surface-criticalStrong border-black hover:bg-surface-critical/90 active:bg-surface-critical/80",
	outline:
		"bg-white border-black hover:bg-surface-hover active:bg-surface-active",
};

const SIZES: Record<ButtonSize, string> = {
	sm: "h-10 px-4 rounded-none gap-2",
	md: "h-12 px-6 rounded-none gap-2",
	lg: "h-14 px-8 rounded-none gap-3",
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
		const { theme } = useTheme();

		const baseStyles =
			"flex-row items-center justify-center border-4 border-black font-bold uppercase tracking-wide transition-all duration-100";
		const variantStyles = disabled ? "" : VARIANTS[variant];
		const sizeStyles = SIZES[size];
		const disabledStyles = disabled
			? `${loading ? "opacity-80" : "opacity-50"} pointer-events-none ${loading ? "bg-icon-interactive" : "bg-input-disabled"}`
			: "";
		const shadowStyles = disabled
			? ""
			: "neo-shadow-md active:neo-shadow-sm active:translate-x-[2px] active:translate-y-[2px]";

		const textBaseStyle = "font-medium text-center";
		const textSizeStyle = TEXT_SIZES[size];

		const isWhiteText = variant === "primary" || variant === "danger";

		const getTextColorClass = () => {
			if (disabled && !loading) return "text-foreground-weak";
			if (isWhiteText) return "text-background";
			return "text-foreground";
		};

		const indicatorColor = isWhiteText ? palette.white : theme.text.base;

		return (
			<Pressable
				ref={ref}
				className={`${baseStyles} ${variantStyles} ${sizeStyles} ${disabledStyles} ${shadowStyles} ${className}`}
				disabled={disabled || loading}
				accessibilityRole="button"
				accessibilityState={{ disabled: disabled || loading, busy: loading }}
				{...props}
			>
				{loading && (
					<ActivityIndicator
						size="small"
						color={indicatorColor}
						style={{ marginRight: 8 }}
					/>
				)}
				{!loading && leftIcon}
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
