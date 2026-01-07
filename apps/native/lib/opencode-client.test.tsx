import {
	checkOpenCodeHealth,
	createCoderOpenCodeClient,
	SessionTokenHeader,
} from "./opencode-client";

jest.mock("@opencode-ai/sdk");

describe("createCoderOpenCodeClient", () => {
	const originalFetch = globalThis.fetch;
	let _mockClient: any;
	let setMockClientGetImplementation: any;

	beforeAll(() => {
		_mockClient = jest.requireMock("@opencode-ai/sdk").mockClient;
		setMockClientGetImplementation =
			jest.requireMock("@opencode-ai/sdk").setMockClientGetImplementation;
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	it("injects Coder-Session-Token header on fetch", async () => {
		let capturedHeaders: Headers | undefined;

		globalThis.fetch = jest.fn(
			(_input: RequestInfo | URL, init?: RequestInit) => {
				capturedHeaders = new Headers(init?.headers);
				return Promise.resolve({
					ok: true,
					json: () => Promise.resolve({}),
				}) as unknown as Response;
			},
		) as jest.Mock;

		const client = createCoderOpenCodeClient({
			baseUrl: "https://opencode--x.coder.example.com",
			sessionToken: "token123",
		});

		setMockClientGetImplementation(globalThis.fetch);

		await client.config.get();

		expect(capturedHeaders?.get(SessionTokenHeader)).toBe("token123");
	});
});

describe("checkOpenCodeHealth", () => {
	const originalFetch = globalThis.fetch;
	let mockClient: any;

	beforeAll(() => {
		mockClient = jest.requireMock("@opencode-ai/sdk").mockClient;
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	it("returns true when config endpoint responds ok", async () => {
		globalThis.fetch = jest.fn(() =>
			Promise.resolve({
				ok: true,
				json: () => Promise.resolve({}),
			}),
		) as jest.Mock;

		const client = createCoderOpenCodeClient({
			baseUrl: "https://opencode.example.com",
			sessionToken: "token",
		});

		mockClient.config.get.mockResolvedValue({ data: {} });
		const result = await checkOpenCodeHealth(client);

		expect(result).toBe(true);
	});

	it("returns false when config endpoint fails", async () => {
		mockClient.config.get.mockRejectedValue(new Error("Failed"));

		const client = createCoderOpenCodeClient({
			baseUrl: "https://opencode.example.com",
			sessionToken: "token",
		});
		const result = await checkOpenCodeHealth(client);

		expect(result).toBe(false);
	});
});
