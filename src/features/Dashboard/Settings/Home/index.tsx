import { ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "@/hooks/useAppTheme";
import { DashboardScreenContainer } from "../../components/DashboardScreenContainer";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SettingsCard } from "./components/SettingsCard";

export const SettingsScreen = () => {
  const { t } = useTranslation();
  const { iconColor } = useAppTheme();

  return (
    <ScrollView>
      <DashboardScreenContainer>
        <View className="flex flex-col w-full p-4 gap-4">
          <SettingsCard
           
              icon={
                <Ionicons name="language" size={24} color={iconColor.default} />
              }
              title={t("settings.language.title")}
              description={t("settings.language.description")}
              href="/dashboard/settings/language"
            />
          

           <SettingsCard
            icon={
              <Ionicons name="server" size={24} color={iconColor.default} />
            }
            title={t("settings.node.title")}
            description={t("settings.node.description")}
            href="/dashboard/settings/nodes"
          />

           <SettingsCard
            icon={<Ionicons name="cash" size={24} color={iconColor.default} />}
            title={t("settings.currency.title")}
            description={t("settings.currency.description")}
            href="/dashboard/settings/currency"
          />
           <SettingsCard
            icon={
              <Ionicons
                name="extension-puzzle"
                size={24}
                color={iconColor.default}
              />
            }
            title={t("settings.about.title")}
            description={t("settings.about.description")}
            href="/dashboard/settings/about"
          />
        </View>
      </DashboardScreenContainer>
    </ScrollView>
  );
};
