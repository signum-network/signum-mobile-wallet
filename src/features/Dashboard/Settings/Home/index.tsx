import { ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "@/hooks/useAppTheme";
import { HorizontalDivider } from "@/components/HorizontalDivider";
import { AccountSwitcher } from "@/components/Account/Switcher";
import { NavLink } from "./components/NavLink";
import { SettingScreenContainer } from "../components/SettingScreenContainer";
import Ionicons from "@expo/vector-icons/Ionicons";

export const SettingsScreen = () => {
  const { t } = useTranslation();
  const { iconColor } = useAppTheme();

  return (
    <ScrollView>
      <SettingScreenContainer>
        <View className="w-full max-w-md mx-auto px-4 pt-4">
          <AccountSwitcher />
        </View>

        <HorizontalDivider />

        <View className="flex flex-col w-full px-4">
          <NavLink
            icon={
              <Ionicons name="language" size={24} color={iconColor.default} />
            }
            title={t("settings.language.title")}
            description={t("settings.language.description")}
            href="/dashboard/settings/language"
          />

          <NavLink
            icon={
              <Ionicons name="server" size={24} color={iconColor.default} />
            }
            title={t("settings.node.title")}
            description={t("settings.node.description")}
            href="/dashboard/settings/nodes"
          />

          <NavLink
            icon={<Ionicons name="cash" size={24} color={iconColor.default} />}
            title={t("settings.currency.title")}
            description={t("settings.currency.description")}
            href="/dashboard/settings/currency"
          />
        </View>
      </SettingScreenContainer>
    </ScrollView>
  );
};
