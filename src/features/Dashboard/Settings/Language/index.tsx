import { ScrollView, View } from "react-native";
import { Text } from "@/components/Text";
import { lngCards } from "@/locales";
import { SettingScreenContainer } from "../components/SettingScreenContainer";
import { LanguageCard } from "./components/LanguageCard";

export const LanguageSettingsScreen = () => {
  return (
    <ScrollView>
      <SettingScreenContainer>
        <View className="flex flex-col items-center justify-center w-full px-4 gap-4 pt-8">
          {lngCards.map(({ lng, label }) => (
            <LanguageCard key={lng} lng={lng} label={label} />
          ))}

          <Text className="font-medium mt-4" color="muted">
            More languages will be included soon!
          </Text>
        </View>
      </SettingScreenContainer>
    </ScrollView>
  );
};
