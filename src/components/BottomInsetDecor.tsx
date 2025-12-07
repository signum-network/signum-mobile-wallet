import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "@/hooks/useAppTheme";

export function BottomInsetDecor() {
  const insets = useSafeAreaInsets();
  const { tokens } = useAppTheme();

  if (insets.bottom === 0) return null;

  return (
    <View
      pointerEvents="none"
      style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}
    >
      <View
        style={{ height: StyleSheet.hairlineWidth, backgroundColor: tokens.border }}
      />

      <View
        style={{ height: insets.bottom, backgroundColor: tokens.surfaceElevated }}
      />
    </View>
  );
}
