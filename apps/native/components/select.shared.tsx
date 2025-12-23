import type React from "react";
import { createContext, useContext } from "react";
import type { ListState, Node } from "react-stately";

export type SelectValue = string;

export interface OptionData<T = unknown> {
	value: SelectValue;
	data?: T;
	disabled?: boolean;
}

export interface SelectContextValue<T = unknown> {
	isOpen: boolean;
	setOpen: (open: boolean) => void;
	selectedValues: Set<SelectValue>;
	selectionMode: "single" | "multiple";
	placeholder?: string;
	disabled?: boolean;
	listState: ListState<T> | null;
	onSelectionChange: (values: Set<SelectValue>) => void;
	label?: string;
}

export const SelectContext = createContext<SelectContextValue | null>(null);

export function useSelectContext<T = unknown>() {
	const ctx = useContext(SelectContext);
	if (!ctx) throw new Error("Select components must be used within Select");
	return ctx as SelectContextValue<T>;
}

export interface SelectRootProps<T = unknown> {
	itemData?: T;
	children: React.ReactNode;
	value?: SelectValue | SelectValue[];
	defaultValue?: SelectValue | SelectValue[];
	onValueChange?: (value: SelectValue | SelectValue[]) => void;
	selectionMode?: "single" | "multiple";
	placeholder?: string;
	disabled?: boolean;
	label?: string;
}

export interface SelectTriggerProps {
	children?: React.ReactNode;
	className?: string;
}

export interface SelectContentProps {
	children?: React.ReactNode;
	className?: string;
}

export interface SelectOptionProps<T = unknown> {
	children: React.ReactNode;
	value: SelectValue;
	disabled?: boolean;
	data?: T;
	className?: string;
}

export interface SelectGroupProps {
	children: React.ReactNode;
	className?: string;
}

export interface SelectGroupLabelProps {
	children: React.ReactNode;
	className?: string;
}

export function hasTrigger(
	children: React.ReactNode,
	TriggerComponent: React.FunctionComponent<SelectTriggerProps>,
): boolean {
	const childArray = Array.isArray(children) ? children : [children];
	return childArray.some(
		(child) =>
			child &&
			typeof child === "object" &&
			"type" in child &&
			child.type === TriggerComponent,
	);
}

export function getDisplayValue<T>(
	selectedValues: Set<SelectValue>,
	items: Iterable<Node<T>>,
	placeholder?: string,
): string {
	if (selectedValues.size === 0) return placeholder ?? "Select...";
	const values: string[] = [];
	for (const item of items) {
		if (selectedValues.has(item.key as string)) {
			values.push(item.textValue ?? String(item.key));
		}
	}
	return values.join(", ") || placeholder || "Select...";
}

export function normalizeToSet(
	value: SelectValue | SelectValue[] | undefined,
	selectionMode: "single" | "multiple",
): Set<SelectValue> {
	if (value === undefined) return new Set();
	if (Array.isArray(value)) return new Set(value);
	return selectionMode === "multiple" ? new Set([value]) : new Set([value]);
}

export function setToValue(
	set: Set<SelectValue>,
	selectionMode: "single" | "multiple",
): SelectValue | SelectValue[] {
	if (selectionMode === "multiple") return Array.from(set);
	const first = set.values().next().value;
	return first ?? "";
}
