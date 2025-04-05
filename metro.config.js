const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push("sql");

/**
 * This blocklist is required for @signumjs/crypto to exclude non-used crypto adapters from bundling,
 * thus avoiding compilation errors
 * @type {RegExp[]}
 */
config.resolver.blockList = [/@signumjs\/crypto\/adapters\/.+$/];

module.exports = wrapWithReanimatedMetroConfig(
  withNativeWind(config, { input: "./global.css" })
);
