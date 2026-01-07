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

let capturedConfig: any = null;

export const createOpencodeClient = jest.fn((config: any) => {
	capturedConfig = config;
	return mockClient;
});

export const setMockClientGetImplementation = (_fetchMock: any) => {
	mockClient.config.get = jest.fn(async () => {
		const response = await capturedConfig.fetch(
			`${capturedConfig.baseUrl}/config`,
			{},
		);
		if (!response.ok) {
			throw new Error("Failed");
		}
		return { data: await response.json() };
	});
};
