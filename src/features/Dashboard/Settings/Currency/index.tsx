import { ScrollView, View } from "react-native";
import { Text } from "@/components/Text";
import { useTranslation } from "react-i18next";
import { DefaultAllowedTickers } from "@/types/currencies";
import { DashboardScreenContainer } from "../../components/DashboardScreenContainer";
import { CurrencyCard } from "./components/CurrencyCard";
import { AppHeader } from "@/components/AppHeader";

export const CurrencySettingsScreen = () => {
  const { t } = useTranslation();
  return (
    <>
      <AppHeader title={t("settings.currency.title")} />
        <DashboardScreenContainer>
             <ScrollView>
          <View className="flex flex-col items-center justify-center w-full px-4 gap-4 pt-8">
            <Text className="font-medium mb-4" color="muted">
              Data provided by Coingecko
            </Text>

            {DefaultAllowedTickers.map((id) => (
              <CurrencyCard key={id} id={id} />
            ))}
          </View>
          </ScrollView>
        </DashboardScreenContainer>
      
    </>
  );
};
