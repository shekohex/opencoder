module.exports = (api) => {
	api.cache(true);
	return {
		presets: [
			["@babel/preset-env", { targets: { node: "current" } }],
			"babel-preset-expo",
			"@babel/preset-typescript",
		],
		plugins: ["transform-flow-strip-types"],
	};
};
