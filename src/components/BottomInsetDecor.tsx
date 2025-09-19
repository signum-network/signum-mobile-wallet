//react-native-edge-to-edge doesn't have SystemBars props to set a background color. So I do it this way..

import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";

export function BottomInsetDecor({
  lightBg,
  darkBg,
  lightLineColor,
  darkLineColor,
}: {
  lightBg: string;
  darkBg: string;
  lightLineColor: string;
  darkLineColor: string;
}) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme(); // "light" | "dark" | null

  if (insets.bottom === 0) return null;

  const bg = colorScheme === "dark" ? darkBg : lightBg;
  const lineColor = colorScheme === "dark" ? darkLineColor : lightLineColor;

  return (
    <View
      pointerEvents="none"
      style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}
    >
      {/* thin line at the top of the system nav area */}
      <View
        style={{ height: StyleSheet.hairlineWidth, backgroundColor: lineColor }}
      />
      {/* background */}
      <View style={{ height: insets.bottom, backgroundColor: bg }} />
    </View>
  );
}
