import { ScrollView, View } from "react-native";
import { DefaultAllowedTickers } from "@/types/currencies";
import { SettingScreenContainer } from "../components/SettingScreenContainer";
import { CurrencyCard } from "./components/CurrencyCard";

export const CurrencySettingsScreen = () => {
  return (
    <ScrollView>
      <SettingScreenContainer>
        <View className="flex flex-col items-start justify-center w-full px-4 gap-4 pt-8">
          {DefaultAllowedTickers.map((id) => (
            <CurrencyCard key={id} id={id} />
          ))}
        </View>
      </SettingScreenContainer>
    </ScrollView>
  );
};
