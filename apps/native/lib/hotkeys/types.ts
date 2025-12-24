export interface HotkeyConfig {
	keys: string;
	description: string;
	scopes?: string[];
	preventDefault?: boolean;
}

export type HotkeyMap<T extends string = string> = Record<T, HotkeyConfig>;
