module.exports = (api) => {
	const isTest = api.env("test");

	api.cache(() => (isTest ? "test" : "prod"));

	return {
		presets: isTest
			? [["babel-preset-expo", { jsxRuntime: "automatic" }]]
			: [["babel-preset-expo", { jsxImportSource: "nativewind" }]],
	};
};
