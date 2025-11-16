import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/hooks/useAppTheme";

export const ThemeModeToggle = () => {
  const { themeMode, setThemeMode, theme } = useAppTheme();

  const activeColor = theme.colors.primary;
  const inactiveColor = theme.colors.text + "55";

  const isLight = themeMode === "light";
  const isDark = themeMode === "dark";

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        paddingVertical: 8,
      }}
    >
      <Pressable onPress={() => setThemeMode(isLight ? "system" : "light")}>
        <Ionicons
          name="sunny-outline"
          size={28}
          color={isLight ? activeColor : inactiveColor}
        />
      </Pressable>

      <Pressable onPress={() => setThemeMode(isDark ? "system" : "dark")}>
        <Ionicons
          name="moon-outline"
          size={26}
          color={isDark ? activeColor : inactiveColor}
        />
      </Pressable>
    </View>
  );
};
