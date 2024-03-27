import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Layout() {
  const { t } = useTranslation();

  return (
    <Tabs initialRouteName="overview" screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        options={{
          title: t("bottomBar.home"),
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
        name="overview"
      />

      <Tabs.Screen
        options={{
          title: t("bottomBar.subscriptions"),
          tabBarIcon: ({ color }) => (
            <Ionicons name="albums" size={24} color={color} />
          ),
        }}
        name="subscriptions"
      />

      <Tabs.Screen
        options={{
          title: t("bottomBar.tokens"),
          tabBarIcon: ({ color }) => (
            <Ionicons name="apps" size={24} color={color} />
          ),
        }}
        name="tokens"
      />

      <Tabs.Screen
        options={{
          title: t("bottomBar.settings"),
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" size={24} color={color} />
          ),
        }}
        name="settings"
      />

      <Tabs.Screen name="deposit" options={{ href: null }} />
      <Tabs.Screen name="transfer" options={{ href: null }} />
    </Tabs>
  );
}
