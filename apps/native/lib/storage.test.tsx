jest.mock("react-native-mmkv", () => {
	const mmkvStore = new Map<string, unknown>();
	return {
		createMMKV: jest.fn(() => ({
			getString: (key: string) => mmkvStore.get(key),
			set: (key: string, value: unknown) => mmkvStore.set(key, value),
			remove: (key: string) => mmkvStore.delete(key),
			getBoolean: (key: string) => mmkvStore.get(key),
		})),
	};
});

const setGlobalLocalStorage = (value: Storage | undefined) => {
	// biome-ignore lint/suspicious/noExplicitAny: Test needs to set undefined
	(global as any).localStorage = value;
};

describe("storage", () => {
	let storage: {
		getString: (key: string) => string | undefined;
		set: (key: string, value: string | boolean | number) => void;
		delete: (key: string) => void;
		getBoolean: (key: string) => boolean;
	};
	let localStorageMock: Map<string, string>;
	let localStorageMockObj: Storage;

	beforeEach(() => {
		jest.clearAllMocks();
		jest.resetModules();

		localStorageMock = new Map();
		localStorageMockObj = {
			getItem: (key: string) => localStorageMock.get(key) ?? null,
			setItem: (key: string, value: string) => localStorageMock.set(key, value),
			removeItem: (key: string) => localStorageMock.delete(key),
			length: localStorageMock.size,
			key: (index: number) => Array.from(localStorageMock.keys())[index],
			clear: () => localStorageMock.clear(),
		} as Storage;
	});

	describe("Native Platform", () => {
		beforeEach(() => {
			setGlobalLocalStorage(undefined);
			jest.doMock("react-native", () => ({
				Platform: {
					OS: "ios",
				},
			}));
			storage = require("./storage").storage;
		});

		describe("getString", () => {
			it("returns stored string value", () => {
				storage.set("username", "john_doe");
				expect(storage.getString("username")).toBe("john_doe");
			});

			it("returns undefined for non-existent key", () => {
				expect(storage.getString("nonexistent")).toBeUndefined();
			});

			it("returns stored boolean as string", () => {
				storage.set("flag", true);
				expect(storage.getString("flag")).toBe(true);
			});

			it("returns stored number as number", () => {
				storage.set("count", 42);
				expect(storage.getString("count")).toBe(42);
			});
		});

		describe("set", () => {
			it("stores string value correctly", () => {
				storage.set("key", "value");
				expect(storage.getString("key")).toBe("value");
			});

			it("stores boolean value correctly", () => {
				storage.set("enabled", true);
				expect(storage.getBoolean("enabled")).toBe(true);
			});

			it("stores number value correctly", () => {
				storage.set("count", 42);
				expect(storage.getString("count")).toBe(42);
			});

			it("stores zero correctly", () => {
				storage.set("zero", 0);
				expect(storage.getString("zero")).toBe(0);
			});

			it("stores empty string correctly", () => {
				storage.set("empty", "");
				expect(storage.getString("empty")).toBe("");
			});

			it("stores unicode characters correctly", () => {
				storage.set("unicode", "🚀 test 测试");
				expect(storage.getString("unicode")).toBe("🚀 test 测试");
			});
		});

		describe("delete", () => {
			it("removes existing key", () => {
				storage.set("key", "value");
				storage.delete("key");
				expect(storage.getString("key")).toBeUndefined();
			});

			it("does not error for non-existent key", () => {
				expect(() => storage.delete("nonexistent")).not.toThrow();
			});

			it("only removes specified key", () => {
				storage.set("key1", "value1");
				storage.set("key2", "value2");
				storage.delete("key1");
				expect(storage.getString("key1")).toBeUndefined();
				expect(storage.getString("key2")).toBe("value2");
			});
		});

		describe("getBoolean", () => {
			it("returns true for stored boolean true", () => {
				storage.set("enabled", true);
				expect(storage.getBoolean("enabled")).toBe(true);
			});

			it("returns false for stored boolean false", () => {
				storage.set("disabled", false);
				expect(storage.getBoolean("disabled")).toBe(false);
			});

			it("returns false for non-existent key", () => {
				expect(storage.getBoolean("nonexistent")).toBe(false);
			});

			it("returns stored number 1", () => {
				storage.set("truthy", 1);
				expect(storage.getBoolean("truthy")).toBe(1);
			});
		});
	});

	describe("Web Platform", () => {
		beforeEach(() => {
			global.localStorage = localStorageMockObj;
			jest.doMock("react-native", () => ({
				Platform: {
					OS: "web",
				},
			}));
			storage = require("./storage").storage;
		});

		describe("getString", () => {
			it("returns string from localStorage", () => {
				localStorageMock.set("username", "john_doe");
				expect(storage.getString("username")).toBe("john_doe");
			});

			it("returns undefined for non-existent key", () => {
				expect(storage.getString("nonexistent")).toBeUndefined();
			});

			it("returns undefined when localStorage.getItem returns null", () => {
				localStorageMock.set("empty", null as unknown as string);
				expect(storage.getString("empty")).toBeUndefined();
			});

			it("returns undefined when localStorage is undefined", () => {
				setGlobalLocalStorage(undefined);
				expect(storage.getString("key")).toBeUndefined();
			});
		});

		describe("set", () => {
			it("stores string in localStorage", () => {
				storage.set("key", "value");
				expect(localStorageMock.get("key")).toBe("value");
			});

			it("stores boolean as string 'true'", () => {
				storage.set("enabled", true);
				expect(localStorageMock.get("enabled")).toBe("true");
			});

			it("stores boolean as string 'false'", () => {
				storage.set("disabled", false);
				expect(localStorageMock.get("disabled")).toBe("false");
			});

			it("stores number as string", () => {
				storage.set("count", 42);
				expect(localStorageMock.get("count")).toBe("42");
			});

			it("stores zero as string '0'", () => {
				storage.set("zero", 0);
				expect(localStorageMock.get("zero")).toBe("0");
			});

			it("stores empty string correctly", () => {
				storage.set("empty", "");
				expect(localStorageMock.get("empty")).toBe("");
			});

			it("stores unicode characters correctly", () => {
				storage.set("unicode", "🚀 test 测试");
				expect(localStorageMock.get("unicode")).toBe("🚀 test 测试");
			});

			it("does nothing when localStorage is undefined", () => {
				setGlobalLocalStorage(undefined);
				expect(() => storage.set("key", "value")).not.toThrow();
			});
		});

		describe("delete", () => {
			it("removes key from localStorage", () => {
				localStorageMock.set("key", "value");
				storage.delete("key");
				expect(localStorageMock.has("key")).toBe(false);
			});

			it("does not error for non-existent key", () => {
				expect(() => storage.delete("nonexistent")).not.toThrow();
			});

			it("only removes specified key", () => {
				localStorageMock.set("key1", "value1");
				localStorageMock.set("key2", "value2");
				storage.delete("key1");
				expect(localStorageMock.has("key1")).toBe(false);
				expect(localStorageMock.get("key2")).toBe("value2");
			});

			it("does nothing when localStorage is undefined", () => {
				setGlobalLocalStorage(undefined);
				expect(() => storage.delete("key")).not.toThrow();
			});
		});

		describe("getBoolean", () => {
			it("returns true when localStorage value is 'true'", () => {
				localStorageMock.set("enabled", "true");
				expect(storage.getBoolean("enabled")).toBe(true);
			});

			it("returns false when localStorage value is 'false'", () => {
				localStorageMock.set("disabled", "false");
				expect(storage.getBoolean("disabled")).toBe(false);
			});

			it("returns false for non-existent key", () => {
				expect(storage.getBoolean("nonexistent")).toBe(false);
			});

			it("returns false when localStorage value is not 'true'", () => {
				localStorageMock.set("other", "yes");
				expect(storage.getBoolean("other")).toBe(false);
			});

			it("returns false when localStorage is undefined", () => {
				setGlobalLocalStorage(undefined);
				expect(storage.getBoolean("key")).toBe(false);
			});
		});
	});

	describe("Integration Scenarios", () => {
		describe("Native platform", () => {
			beforeEach(() => {
				setGlobalLocalStorage(undefined);
				jest.doMock("react-native", () => ({
					Platform: {
						OS: "ios",
					},
				}));
				storage = require("./storage").storage;
			});

			it("set/get flow works correctly", () => {
				storage.set("key", "value");
				expect(storage.getString("key")).toBe("value");
			});

			it("delete followed by get returns undefined", () => {
				storage.set("key", "value");
				storage.delete("key");
				expect(storage.getString("key")).toBeUndefined();
			});

			it("overwriting existing value works", () => {
				storage.set("key", "value1");
				storage.set("key", "value2");
				expect(storage.getString("key")).toBe("value2");
			});

			it("boolean set/get round-trip works", () => {
				storage.set("flag", true);
				expect(storage.getBoolean("flag")).toBe(true);
			});
		});

		describe("Web platform", () => {
			beforeEach(() => {
				global.localStorage = localStorageMockObj;
				jest.doMock("react-native", () => ({
					Platform: {
						OS: "web",
					},
				}));
				storage = require("./storage").storage;
			});

			it("set/get flow works correctly", () => {
				storage.set("key", "value");
				expect(storage.getString("key")).toBe("value");
			});

			it("delete followed by get returns undefined", () => {
				storage.set("key", "value");
				storage.delete("key");
				expect(storage.getString("key")).toBeUndefined();
			});

			it("overwriting existing value works", () => {
				storage.set("key", "value1");
				storage.set("key", "value2");
				expect(storage.getString("key")).toBe("value2");
			});

			it("boolean set/get round-trip works", () => {
				storage.set("flag", true);
				expect(storage.getBoolean("flag")).toBe(true);
			});
		});
	});

	describe("Edge Cases", () => {
		it("handles empty string as key", () => {
			setGlobalLocalStorage(undefined);
			jest.doMock("react-native", () => ({
				Platform: {
					OS: "ios",
				},
			}));
			storage = require("./storage").storage;
			storage.set("", "value");
			expect(storage.getString("")).toBe("value");
		});

		it("handles special characters in key", () => {
			setGlobalLocalStorage(undefined);
			jest.doMock("react-native", () => ({
				Platform: {
					OS: "ios",
				},
			}));
			storage = require("./storage").storage;
			storage.set("key-123_special@value", "value");
			expect(storage.getString("key-123_special@value")).toBe("value");
		});

		it("handles very long key names", () => {
			setGlobalLocalStorage(undefined);
			jest.doMock("react-native", () => ({
				Platform: {
					OS: "ios",
				},
			}));
			storage = require("./storage").storage;
			const longKey = "a".repeat(1000);
			storage.set(longKey, "value");
			expect(storage.getString(longKey)).toBe("value");
		});

		it("handles multiple operations in sequence", () => {
			setGlobalLocalStorage(undefined);
			jest.doMock("react-native", () => ({
				Platform: {
					OS: "ios",
				},
			}));
			storage = require("./storage").storage;
			storage.set("key1", "value1");
			storage.set("key2", "value2");
			storage.set("key3", "value3");
			expect(storage.getString("key1")).toBe("value1");
			expect(storage.getString("key2")).toBe("value2");
			expect(storage.getString("key3")).toBe("value3");
			storage.delete("key2");
			expect(storage.getString("key2")).toBeUndefined();
			storage.set("key1", "new-value");
			expect(storage.getString("key1")).toBe("new-value");
		});
	});
});
