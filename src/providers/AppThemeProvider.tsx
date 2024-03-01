import { View } from "react-native";
import { ThemeProvider } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ChildrenProps } from "@/types/childrenProps";
import { StatusBar } from "expo-status-bar";

export const AppThemeProvider = ({ children }: ChildrenProps) => {
  const { isDarkMode, theme } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: theme.colors.background,
      }}
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <ThemeProvider value={theme}>{children}</ThemeProvider>
    </View>
  );
};
