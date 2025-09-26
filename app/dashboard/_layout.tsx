
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
type TabBarIconProperties = { color: string };

export default function Layout() {
  const { t } = useTranslation();

  const tabBarIconSize = 28;
  const tabBarLabelStyle = { fontSize: 12 };
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 72 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
          paddingTop: 8,
          backgroundColor: "transparent",
          borderTopWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle,
      }}
    >
      <Tabs.Screen
        options={{
          title: t("bottomBar.home"),
          tabBarIcon: ({ color }: TabBarIconProperties) => (
            <Ionicons name="home" size={tabBarIconSize} color={color} />
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
              name="people-circle-outline"
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
            <Ionicons name="apps" size={tabBarIconSize} color={color} />
          ),
          tabBarLabelStyle,
        }}
        name="tokens"
      />

      <Tabs.Screen
        options={{
          title: t("bottomBar.miner"),
          tabBarIcon: ({ color }: TabBarIconProperties) => (
            <Ionicons name="cog" size={tabBarIconSize} color={color} />
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
            <Ionicons name="settings" size={tabBarIconSize} color={color} />
          ),
          tabBarLabelStyle,
        }}
        name="settings"
      />

      <Tabs.Screen name="subscriptions" options={{ href: null }} />
    </Tabs>
  );
}
