import { ScrollView, View } from "react-native";
import { Text } from "@/components/Text";
import { DefaultAllowedTickers } from "@/types/currencies";
import { DashboardScreenContainer } from "../../components/DashboardScreenContainer";
import { CurrencyCard } from "./components/CurrencyCard";

export const CurrencySettingsScreen = () => {
  return (
    <ScrollView>
      <DashboardScreenContainer>
        <View className="flex flex-col items-center justify-center w-full px-4 gap-4 pt-8">
          <Text className="font-medium mb-4" color="muted">
            Data provided by Coingecko
          </Text>

          {DefaultAllowedTickers.map((id) => (
            <CurrencyCard key={id} id={id} />
          ))}
        </View>
      </DashboardScreenContainer>
    </ScrollView>
  );
};
