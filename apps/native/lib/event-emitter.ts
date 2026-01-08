type Listener<T> = (data: T) => void;
type Unsubscribe = () => void;

export interface TypedEmitter<Events extends Record<string, unknown>> {
	on<K extends keyof Events>(
		event: K,
		listener: Listener<Events[K]>,
	): Unsubscribe;
	emit<K extends keyof Events>(event: K, data: Events[K]): void;
	off<K extends keyof Events>(event: K, listener: Listener<Events[K]>): void;
	clear(): void;
}

export interface GlobalEmitter<T> {
	on(key: string, listener: Listener<T>): Unsubscribe;
	listen(listener: (key: string, data: T) => void): Unsubscribe;
	emit(key: string, data: T): void;
	off(key: string, listener: Listener<T>): void;
	clear(): void;
}

export function createTypedEmitter<
	Events extends Record<string, unknown>,
>(): TypedEmitter<Events> {
	const listeners = new Map<keyof Events, Set<Listener<unknown>>>();

	return {
		on<K extends keyof Events>(
			event: K,
			listener: Listener<Events[K]>,
		): Unsubscribe {
			if (!listeners.has(event)) {
				listeners.set(event, new Set());
			}
			listeners.get(event)?.add(listener as Listener<unknown>);
			return () => this.off(event, listener);
		},

		emit<K extends keyof Events>(event: K, data: Events[K]): void {
			const eventListeners = listeners.get(event);
			if (eventListeners) {
				for (const listener of eventListeners) {
					listener(data);
				}
			}
		},

		off<K extends keyof Events>(event: K, listener: Listener<Events[K]>): void {
			const eventListeners = listeners.get(event);
			if (eventListeners) {
				eventListeners.delete(listener as Listener<unknown>);
			}
		},

		clear(): void {
			listeners.clear();
		},
	};
}

export function createGlobalEmitter<T>(): GlobalEmitter<T> {
	const keyListeners = new Map<string, Set<Listener<T>>>();
	const globalListeners = new Set<(key: string, data: T) => void>();

	return {
		on(key: string, listener: Listener<T>): Unsubscribe {
			if (!keyListeners.has(key)) {
				keyListeners.set(key, new Set());
			}
			keyListeners.get(key)?.add(listener);
			return () => this.off(key, listener);
		},

		listen(listener: (key: string, data: T) => void): Unsubscribe {
			globalListeners.add(listener);
			return () => {
				globalListeners.delete(listener);
			};
		},

		emit(key: string, data: T): void {
			const listeners = keyListeners.get(key);
			if (listeners) {
				for (const listener of listeners) {
					listener(data);
				}
			}
			for (const listener of globalListeners) {
				listener(key, data);
			}
		},

		off(key: string, listener: Listener<T>): void {
			const listeners = keyListeners.get(key);
			if (listeners) {
				listeners.delete(listener);
			}
		},

		clear(): void {
			keyListeners.clear();
			globalListeners.clear();
		},
	};
}
