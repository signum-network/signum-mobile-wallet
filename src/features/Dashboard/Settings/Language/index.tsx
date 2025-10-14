import { ScrollView, View } from "react-native";
import { Text } from "@/components/Text";
import { useTranslation } from "react-i18next";
import { lngCards } from "@/locales";
import { DashboardScreenContainer } from "../../components/DashboardScreenContainer";
import { LanguageCard } from "./components/LanguageCard";
import { AppHeader } from "@/components/AppHeader";

export const LanguageSettingsScreen = () => {
  const { t } = useTranslation();

  return (
    <>
      <AppHeader title={t("settings.language.title")} />
      <DashboardScreenContainer>
        <ScrollView>
          <View className="flex flex-col items-center justify-center w-full px-4 gap-4 pt-8 pb-16">
            {lngCards.map(({ lng, label }) => (
              <LanguageCard key={lng} lng={lng} label={label} />
            ))}
          </View>
        </ScrollView>
      </DashboardScreenContainer>
    </>
  );
};
