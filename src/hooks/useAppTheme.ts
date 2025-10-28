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
      primary: isDarkMode ? "#0099ff" : "#0099ff",
    },
  };

  const iconColor = {
    primary: theme.colors.primary,
    default: theme.colors.text,
    blackout: theme.colors.card,
    muted: isDarkMode ? "#71717A" : "#A1A1AA",
    green: isDarkMode ? "#22C55E" : "#16A34A",
    red: isDarkMode ? "#EF4444" : "#DC2626",
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
