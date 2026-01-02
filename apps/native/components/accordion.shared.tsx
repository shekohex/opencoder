import { createContext, useContext } from "react";

export type AccordionType = "single" | "multiple";
export type AccordionValue = string | string[];

export interface AccordionRootContextValue {
	type: AccordionType;
	value: string[];
	collapsible: boolean;
	disabled: boolean;
	disableAnimation: boolean;
	setValue: (next: string[]) => void;
	toggleValue: (value: string, itemDisabled?: boolean) => void;
}

export interface AccordionItemContextValue {
	value: string;
	isExpanded: boolean;
	isDisabled: boolean;
	toggle: () => void;
}

export const AccordionContext = createContext<AccordionRootContextValue | null>(
	null,
);
export const AccordionItemContext =
	createContext<AccordionItemContextValue | null>(null);

export function useAccordionContext() {
	const ctx = useContext(AccordionContext);
	if (!ctx) {
		throw new Error("Accordion components must be used within Accordion");
	}
	return ctx;
}

export function useAccordionItemContext() {
	const ctx = useContext(AccordionItemContext);
	if (!ctx) {
		throw new Error(
			"Accordion item components must be used within Accordion.Item",
		);
	}
	return ctx;
}

export function normalizeAccordionValue(
	value: AccordionValue | undefined,
	type: AccordionType,
): string[] {
	if (value === undefined) return [];
	if (Array.isArray(value)) {
		return type === "single" ? value.slice(0, 1) : value;
	}
	return value ? [value] : [];
}

export function serializeAccordionValue(
	value: string[],
	type: AccordionType,
): AccordionValue {
	if (type === "multiple") return value;
	return value[0] ?? "";
}
