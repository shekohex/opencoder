import type { ReactNode } from "react";

export interface BottomSheetContextValue {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
	snapPoints: string[];
	setSnapPoints: (points: string[]) => void;
}

export interface BottomSheetProps {
	children: ReactNode;
	isOpen?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (isOpen: boolean) => void;
	snapPoints?: string[];
}

export interface BottomSheetTriggerProps {
	children: ReactNode;
	asChild?: boolean;
}

export interface BottomSheetContentProps {
	children: ReactNode;
	className?: string;
}

export interface BottomSheetCloseProps {
	children: ReactNode;
	asChild?: boolean;
}
