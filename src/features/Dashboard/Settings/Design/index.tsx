import { ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";
import { DashboardScreenContainer } from "../../components/DashboardScreenContainer";
import { DesignCard } from "./components/DesignCard";
import { AppHeader } from "@/components/AppHeader";
import type { ThemeDesign } from "@/theme/tokens";

const AVAILABLE_DESIGNS: ThemeDesign[] = [
  "defaultLight",
  "defaultDark",
  "bubblegum",
  "midnight",
  "solarized",
  "sunrise",
  "rogueEmberDark"
];

export const DesignSettingsScreen = () => {
  const { t } = useTranslation();

  return (
    <>
      <AppHeader title={t("settings.design.title")} />

      <DashboardScreenContainer>
        <ScrollView>
          <View className="flex flex-col w-full gap-4 px-4 pt-4 pb-16">
            {AVAILABLE_DESIGNS.map((id) => (
              <DesignCard key={id} id={id} />
            ))}
          </View>
        </ScrollView>
      </DashboardScreenContainer>
    </>
  );
};
