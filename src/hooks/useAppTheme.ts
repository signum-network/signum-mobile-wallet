import { useEffect } from "react";
import { useColorScheme } from "nativewind";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { appStore } from "@/states/appStore";
import type { ThemePreference } from "@/states/appStore";

type NavigationTheme = typeof DefaultTheme;

export const useAppTheme = () => {
  const { colorScheme, setColorScheme } = useColorScheme(); 
  const themeMode = appStore((s) => s.themeMode);          
  const setThemeMode = appStore((s) => s.setThemeMode);
  const cycleThemeMode = appStore((s) => s.cycleThemeMode);

  const resolvedScheme: "light" | "dark" =
    themeMode === "system" ? (colorScheme === "dark" ? "dark" : "light") : themeMode;

  const isDarkMode = resolvedScheme === "dark";

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
    setColorScheme(themeMode as ThemePreference);
  }, [themeMode, setColorScheme]);

  return {
    isDarkMode,
    theme,
    themeMode,          
    resolvedScheme,      
    iconColor,
    setThemeMode,        
    cycleThemeMode, 
  };
};
