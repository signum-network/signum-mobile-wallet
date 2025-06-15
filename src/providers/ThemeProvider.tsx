import { View } from "react-native";
import { useMemo } from "react";
import { usePathname } from "expo-router";
import { ThemeProvider as ReactNavigationThemeProvider } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "@/hooks/useAppTheme";
import type { ChildrenProps } from "@/types/childrenProps";
import { SystemBars } from "react-native-edge-to-edge";

export const ThemeProvider = ({ children }: ChildrenProps) => {
  const { isDarkMode, theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const dynamicTopInset = useMemo(() => {
    switch (pathname) {
      case "/terms":

      case "/dashboard/overview/activity":
      case "/dashboard/settings/account":
      case "/dashboard/settings/language":
      case "/dashboard/settings/currency":
      case "/dashboard/settings/features":
      case "/dashboard/settings/nodes":
      case "/dashboard/settings/about":
        return 0;

      default:
        return insets.top;
    }
  }, [insets, pathname]);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: dynamicTopInset,
        backgroundColor: theme.colors.background,
      }}
    >
      <SystemBars style={isDarkMode ? "light" : "dark"} />
      <ReactNavigationThemeProvider value={theme}>
        {children}
      </ReactNavigationThemeProvider>
    </View>
  );
};
