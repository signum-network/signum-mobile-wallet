import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/hooks/useAppTheme";

export const ThemeModeToggle = () => {
  const { themeMode, setThemeMode, theme } = useAppTheme();

  const activeColor = theme.colors.primary;
  const inactiveColor = theme.colors.text + "55";

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
      {/* System */}
      <Pressable onPress={() => setThemeMode("system")}>
        <Ionicons
          name="aperture-outline"
          size={28}
          color={themeMode === "system" ? activeColor : inactiveColor}
        />
      </Pressable>

      {/* Light */}
      <Pressable onPress={() => setThemeMode("light")}>
        <Ionicons
          name="sunny-outline"
          size={28}
          color={themeMode === "light" ? activeColor : inactiveColor}
        />
      </Pressable>

      {/* Dark */}
      <Pressable onPress={() => setThemeMode("dark")}>
        <Ionicons
          name="moon-outline"
          size={26}
          color={themeMode === "dark" ? activeColor : inactiveColor}
        />
      </Pressable>
    </View>
  );
};
