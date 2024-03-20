import { useEffect } from "react";
import { useColorScheme } from "nativewind";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { appStore } from "@/states/appStore";

export const useAppTheme = () => {
  const { setColorScheme } = useColorScheme();
  const themeMode = appStore((state) => state.themeMode);
  const toggleThemeMode = appStore((state) => state.toggleThemeMode);

  const isDarkMode = themeMode === "dark";

  const theme = isDarkMode ? DarkTheme : DefaultTheme;

  const iconColor = {
    default: theme.colors.text,
    blackout: theme.colors.card,
  };

  useEffect(() => {
    setColorScheme(themeMode || "system");
  }, [themeMode, setColorScheme]);

  return { isDarkMode, theme, themeMode, iconColor, toggleThemeMode };
};
