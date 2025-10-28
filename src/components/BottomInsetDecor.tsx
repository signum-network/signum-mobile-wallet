import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "@/hooks/useAppTheme";

export function BottomInsetDecor() {
  const insets = useSafeAreaInsets();
  const { theme, isDarkMode } = useAppTheme();

  if (insets.bottom === 0) return null;

  const lightBgColor = "#fff";
  const darkBgColor = "#1C1C1E";
  const bgColor = isDarkMode ? darkBgColor : lightBgColor;

  const lightLineColor = "#e0e0e0";
  const darkLineColor = "#444444";
  const lineColor = isDarkMode ? darkLineColor : lightLineColor;

  return (
    <View
      pointerEvents="none"
      style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}
    >
      <View
        style={{ height: StyleSheet.hairlineWidth, backgroundColor: lineColor }}
      />
      <View style={{ height: insets.bottom, backgroundColor: bgColor }} />
    </View>
  );
}
