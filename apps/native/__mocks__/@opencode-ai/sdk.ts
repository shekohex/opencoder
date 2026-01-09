export const mockClient = {
	config: {
		get: jest.fn(),
	},
	project: {
		list: jest.fn(),
	},
	session: {
		list: jest.fn(),
		create: jest.fn(),
	},
};

interface CapturedConfig {
	baseUrl: string;
	fetch: typeof fetch;
}

let capturedConfig: CapturedConfig | null = null;

export const createOpencodeClient = jest.fn((config: CapturedConfig) => {
	capturedConfig = config;
	return mockClient;
});

export const setMockClientGetImplementation = (_fetchMock: typeof fetch) => {
	mockClient.config.get = jest.fn(async () => {
		const response = await capturedConfig!.fetch(
			`${capturedConfig!.baseUrl}/config`,
			{},
		);
		if (!response.ok) {
			throw new Error("Failed");
		}
		return { data: await response.json() };
	});
};
