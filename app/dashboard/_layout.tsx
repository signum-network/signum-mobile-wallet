import { useMemo } from "react";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/hooks/useAppStore";
import Ionicons from "@expo/vector-icons/Ionicons";

type TabBarIconProperties = { color: string };

export default function Layout() {
  const { t } = useTranslation();
  const { minerMode } = useAppStore();

  const tabBarIconSize = 28;
  const tabBarLabelStyle = { fontSize: 12 };

  const minerTab = useMemo(
    () =>
      minerMode ? (
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
      ) : (
        <Tabs.Screen name="commitment" options={{ href: null }} />
      ),
    [minerMode]
  );

  return (
    <Tabs
      initialRouteName="overview"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 116, paddingTop: 15, paddingBottom: 56 },
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
          title: t("bottomBar.subscriptions"),
          tabBarIcon: ({ color }: TabBarIconProperties) => (
            <Ionicons name="albums" size={tabBarIconSize} color={color} />
          ),
          tabBarLabelStyle,
        }}
        name="subscriptions"
      />

      {minerTab}

      <Tabs.Screen
        options={{
          title: t("bottomBar.settings"),
          tabBarIcon: ({ color }: TabBarIconProperties) => (
            <Ionicons name="settings" size={tabBarIconSize} color={color} />
          ),
          tabBarLabelStyle,
        }}
        name="settings"
      />

      <Tabs.Screen name="account" options={{ href: null }} />
      <Tabs.Screen name="deposit" options={{ href: null }} />
      <Tabs.Screen name="transfer" options={{ href: null }} />
    </Tabs>
  );
}
