import { ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { HorizontalDivider } from "@/components/HorizontalDivider";
import { NavLink } from "./components/NavLink";
import Ionicons from "@expo/vector-icons/Ionicons";

export const SettingsScreen = () => {
  const { t } = useTranslation();
  const { iconColor } = useAppTheme();

  return (
    <ScrollView>
      <View className="flex-1 flex flex-col items-start justify-start mb-8 gap-4">
        <View className="w-full max-w-md mx-auto px-4 pt-4">
          <Card>
            <Text>Account Switcher</Text>
          </Card>
        </View>

        <HorizontalDivider />

        <View className="flex flex-col w-full max-w-md mx-auto px-4 gap-2">
          <NavLink
            icon={
              <Ionicons name="bag-check" size={24} color={iconColor.default} />
            }
            title="App Language"
            description="Change app language"
            href="/dashboard/settings/language"
          />

          <NavLink
            icon={
              <Ionicons name="bag-check" size={24} color={iconColor.default} />
            }
            title="App Language"
            description="Change app language"
            href="/dashboard/settings/language"
          />

          <NavLink
            icon={
              <Ionicons name="bag-check" size={24} color={iconColor.default} />
            }
            title="App Language"
            description="Change app language"
            href="/dashboard/settings/language"
          />

          <NavLink
            icon={
              <Ionicons name="bag-check" size={24} color={iconColor.default} />
            }
            title="App Language"
            description="Change app language"
            href="/dashboard/settings/language"
          />
        </View>
      </View>
    </ScrollView>
  );
};
