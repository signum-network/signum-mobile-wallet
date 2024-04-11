import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Layout() {
  const { t } = useTranslation();

  return (
    <Tabs
      initialRouteName="overview"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 80, paddingTop: 15, paddingBottom: 15 },
      }}
    >
      <Tabs.Screen
        options={{
          title: t("bottomBar.home"),
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={28} color={color} />
          ),
          tabBarLabelStyle: { fontSize: 12 },
        }}
        name="overview"
      />

      <Tabs.Screen
        options={{
          title: t("bottomBar.tokens"),
          tabBarIcon: ({ color }) => (
            <Ionicons name="apps" size={28} color={color} />
          ),
          tabBarLabelStyle: { fontSize: 12 },
        }}
        name="tokens"
      />

      <Tabs.Screen
        options={{
          title: t("bottomBar.subscriptions"),
          tabBarIcon: ({ color }) => (
            <Ionicons name="albums" size={28} color={color} />
          ),
          tabBarLabelStyle: { fontSize: 12 },
        }}
        name="subscriptions"
      />

      <Tabs.Screen
        options={{
          title: t("bottomBar.settings"),
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" size={28} color={color} />
          ),
          tabBarLabelStyle: { fontSize: 12 },
        }}
        name="settings"
      />

      <Tabs.Screen name="deposit" options={{ href: null }} />
      <Tabs.Screen name="transfer" options={{ href: null }} />
    </Tabs>
  );
}
