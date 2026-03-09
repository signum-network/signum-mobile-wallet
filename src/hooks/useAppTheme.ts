import { useEffect, useMemo } from "react";
import { useColorScheme } from "nativewind";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { appStore } from "@/states/appStore";
import { themeTokens, type ThemeDesign, type ThemeTokens } from "@/theme/tokens";

type NavigationTheme = typeof DefaultTheme;

const DARK_DESIGNS: ThemeDesign[] = [
  "defaultDark",
  "midnight",
  "solarized",
  "rogueEmberDark"
];

export const useAppTheme = () => {
  const { setColorScheme } = useColorScheme(); 

  const themeDesign = appStore((s) => s.themeDesign);
  const setThemeDesign = appStore((s) => s.setThemeDesign);


  const isDarkMode = DARK_DESIGNS.includes(themeDesign);

  const tokens: ThemeTokens = themeTokens[themeDesign];

  // React Navigation Theme
  const theme: NavigationTheme = useMemo(
    () => ({
      ...(isDarkMode ? DarkTheme : DefaultTheme),
      colors: {
        ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
        primary: tokens.primary,
        background: tokens.background,
        card: tokens.surface,
        text: tokens.text,
        border: tokens.border,
        notification: tokens.error,
      },
    }),
    [isDarkMode, tokens]
  );

  const iconColor = {
    primary: tokens.primary,
    default: tokens.text,
    blackout: tokens.surface,
    muted: tokens.textMuted,
    green: tokens.success,
    red: tokens.error,
  };

  useEffect(() => {
    setColorScheme(isDarkMode ? "dark" : "light");
  }, [isDarkMode, setColorScheme]);

  return {
    isDarkMode,
    theme,
    themeDesign,
    tokens,
    iconColor,
    setThemeDesign,
  };
};
