import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "@/hooks/useAppTheme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { StackActions } from "@react-navigation/native";
import InactivityGuard from "@/features/Auth/components/InactivityGuard";
import {PUBLIC_INACTIVITY_AUTO_LOCK} from "@/types/constants";

type TabBarIconProperties = { color: string };

export default function Layout() {
  const { t } = useTranslation();
  const { isDarkMode, tokens } = useAppTheme();
  const tabBarIconSize = 28;
  const tabBarLabelStyle = { fontSize: 12 };
  const insets = useSafeAreaInsets();

  const tabBarActiveColor = tokens.primary;
  const tabBarInactiveColor = tokens.textMuted;

  return (
    <InactivityGuard
      timeoutMs={PUBLIC_INACTIVITY_AUTO_LOCK}
      backgroundGraceMs={PUBLIC_INACTIVITY_AUTO_LOCK}
      onLogout={() => {
        // handled elsewhere
      }}
    >
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 72 + insets.bottom,
            paddingBottom: 8 + insets.bottom,
            paddingTop: 8,
            backgroundColor: tokens.surfaceElevated ?? tokens.surface,
            borderTopWidth: isDarkMode ? 0.5 : 0.25,
            borderTopColor: tokens.border,
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarLabelStyle,
          tabBarActiveTintColor: tabBarActiveColor,
          tabBarInactiveTintColor: tabBarInactiveColor,
        }}
        // Reset each tab's navigation stack to its root screen
        screenListeners={({ navigation, route }) => ({
          tabPress: () => {
            const tabsState = navigation.getState();
            const pressed = tabsState.routes.find((r) => r.key === route.key);
            const nested = pressed?.state;
            if (
              nested &&
              typeof nested.index === "number" &&
              nested.index > 0 &&
              (nested.type?.includes("stack") || nested.routeNames)
            ) {
              navigation.dispatch({
                ...StackActions.popToTop(),
                target: nested.key,
              });
            }
          },
        })}
      >
        <Tabs.Screen
          options={{
            title: t("bottomBar.transfer"),
            tabBarIcon: ({ color }: TabBarIconProperties) => (
              <Ionicons
                name="swap-vertical-outline"
                size={tabBarIconSize}
                color={color}
              />
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
              <Ionicons
                name="apps-outline"
                size={tabBarIconSize}
                color={color}
              />
            ),
            tabBarLabelStyle,
          }}
          name="tokens"
        />

        <Tabs.Screen
          options={{
            title: t("bottomBar.miner"),
            tabBarIcon: ({ color }: TabBarIconProperties) => (
              <MaterialCommunityIcons
                name="harddisk"
                size={tabBarIconSize}
                color={color}
              />
            ),
            tabBarLabelStyle,
          }}
          name="commitment"
        />

        <Tabs.Screen
          options={{
            title: t("bottomBar.settings"),
            tabBarIcon: ({ color }: TabBarIconProperties) => (
              <Ionicons
                name="settings-outline"
                size={tabBarIconSize}
                color={color}
              />
            ),
            tabBarLabelStyle,
          }}
          name="settings"
        />

        <Tabs.Screen name="subscriptions" options={{ href: null }} />
        <Tabs.Screen name="deeplink" options={{ href: null }} />
      </Tabs>
    </InactivityGuard>
  );
}
