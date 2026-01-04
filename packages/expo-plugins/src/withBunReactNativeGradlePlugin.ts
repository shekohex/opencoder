import type { ConfigPlugin } from "@expo/config-plugins";
import { withSettingsGradle } from "@expo/config-plugins";

const withBunReactNativeGradlePlugin: ConfigPlugin = (config) =>
	withSettingsGradle(config, (config) => {
		const contents = config.modResults.contents;
		const marker = "  def reactNativeGradlePlugin = new File(\n";
		if (!contents.includes(marker)) {
			return config;
		}

		const fallbackBlock =
			"  if (!new File(reactNativeGradlePlugin).exists()) {\n" +
			'  \tdef bunRoot = new File(rootDir, "../node_modules/.bun")\n' +
			'  \tdef candidates = bunRoot.exists() ? bunRoot.listFiles().findAll { it.name.startsWith("@react-native+gradle-plugin@") } : []\n' +
			"  \tif (candidates && !candidates.isEmpty()) {\n" +
			'  \t\treactNativeGradlePlugin = new File(candidates[0], "node_modules/@react-native/gradle-plugin").absolutePath\n' +
			"  \t}\n" +
			"  }\n";

		config.modResults.contents = contents.replace(
			"  ).getParentFile().absolutePath\n",
			`  ).getParentFile().absolutePath\n${fallbackBlock}`,
		);

		return config;
	});

export default withBunReactNativeGradlePlugin;
