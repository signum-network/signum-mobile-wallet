const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const { wrapWithReanimatedMetroConfig } = require("react-native-reanimated/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const { assetExts, sourceExts } = config.resolver;

config.resolver.assetExts = [...assetExts, "html", "sql"];

config.resolver.sourceExts = sourceExts.filter((ext) => ext !== "sql");

config.resolver.blockList = [/@signumjs\/crypto\/adapters\/.+$/];

module.exports = wrapWithReanimatedMetroConfig(
  withNativeWind(config, { input: "./global.css" })
);
