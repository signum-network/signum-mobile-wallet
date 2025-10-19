
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "@/hooks/useAppTheme";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
type TabBarIconProperties = { color: string };

export default function Layout() {
  const { t } = useTranslation();
  const { theme, isDarkMode } = useAppTheme();
  const tabBarIconSize = 28;
  const tabBarLabelStyle = { fontSize: 12 };
  const insets = useSafeAreaInsets();

  const tabBarActiveColor  = isDarkMode ? "#0099ff" : "#0099ff";
  const tabBarInactiveColor = isDarkMode ? "#777777" : "#999999";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 72 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
          paddingTop: 8,
          backgroundColor:  isDarkMode ? "#000" : theme.colors.card,
          borderTopWidth: isDarkMode ? 0.5 : 0.25,
          borderTopColor: isDarkMode ? "#444444" : "#e0e0e0",
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle,
        tabBarActiveTintColor: tabBarActiveColor, 
        tabBarInactiveTintColor: tabBarInactiveColor,
      }}
    >
      <Tabs.Screen
        options={{
          title: t("bottomBar.transfer"),
          tabBarIcon: ({ color }: TabBarIconProperties) => (
            <Ionicons name="swap-vertical-outline" size={tabBarIconSize} color={color} />
          ),
          tabBarLabelStyle,
        }}
        name="overview"
      />

      <Tabs.Screen
        options={{
          title: t("bottomBar.accounts"),
          tabBarIcon: ({ color }: TabBarIconProperties) => (
            <Ionicons
              name="people-outline"
              size={tabBarIconSize}
              color={color}
            />
          ),
          tabBarLabelStyle,
        }}
        name="account"
      />

      <Tabs.Screen
        options={{
          title: t("bottomBar.tokens"),
          tabBarIcon: ({ color }: TabBarIconProperties) => (
            <Ionicons name="apps-outline" size={tabBarIconSize} color={color} />
          ),
          tabBarLabelStyle,
        }}
        name="tokens"
      />

      <Tabs.Screen
        options={{
          title: t("bottomBar.miner"),
          tabBarIcon: ({ color }: TabBarIconProperties) => (

            <MaterialCommunityIcons name="harddisk" size={tabBarIconSize} color={color}/>
          ),
          tabBarLabelStyle,
        }}
        name="commitment"
      />
      <Tabs.Screen
        options={{
          popToTopOnBlur: true,
          title: t("bottomBar.settings"),
          tabBarIcon: ({ color }: TabBarIconProperties) => (
            <Ionicons name="settings-outline" size={tabBarIconSize} color={color} />
          ),
          tabBarLabelStyle,
        }}
        name="settings"
      />

      <Tabs.Screen name="subscriptions" options={{ href: null }} />
    </Tabs>
  );
}
