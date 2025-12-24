import type { ActionId } from "./defaults";

export function useHotkeys(
	_action: ActionId,
	_callback: (e: unknown) => void,
	_options?: {
		enabled?: boolean;
		preventDefault?: boolean;
	},
) {
	// No-op on native
}
