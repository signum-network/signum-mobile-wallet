import { useEffect } from "react";
import { useColorScheme } from "nativewind";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { appStore } from "@/states/appStore";

type NavigationTheme = typeof DefaultTheme;

export const useAppTheme = () => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const themeMode = appStore((state) => state.themeMode);
  const toggleThemeMode = appStore((state) => state.toggleThemeMode);

  const scheme = colorScheme ?? "light";
  const isDarkMode = scheme === "dark";

  //overwrite primary color 
  const theme: NavigationTheme = {
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
      primary: isDarkMode ? "#0066ff" : "#0099ff",
    },
  };

  const iconColor = {
    primary: theme.colors.primary,
    default: theme.colors.text,
    blackout: theme.colors.card,
  };

  useEffect(() => {
    setColorScheme(themeMode || "system");
  }, [themeMode, setColorScheme]);

  return { isDarkMode, theme, themeMode, iconColor, toggleThemeMode };
};
