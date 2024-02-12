import { useEffect } from "react";
import { useColorScheme } from "nativewind";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { appStore } from "@/states/appStore";

export const useAppTheme = () => {
  const { setColorScheme } = useColorScheme();
  const themeMode = appStore((state) => state.themeMode);
  const toggleThemeMode = appStore((state) => state.toggleThemeMode);

  const theme = themeMode === "dark" ? DarkTheme : DefaultTheme;

  const iconColor = theme.colors.card;

  useEffect(() => {
    setColorScheme(themeMode || "system");
  }, [themeMode, setColorScheme]);

  return { theme, themeMode, iconColor, toggleThemeMode };
};
