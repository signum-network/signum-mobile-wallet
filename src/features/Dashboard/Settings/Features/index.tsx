import { ScrollView, View } from "react-native";
import { DashboardScreenContainer } from "../../components/DashboardScreenContainer";
import { Fingerprint } from "./sections/Fingerprint";

export const FeaturesSettingsScreen = () => {
  return (
    <ScrollView>
      <DashboardScreenContainer>
        <View className="flex flex-col items-center justify-center w-full px-4 gap-4 pt-8">
          <Fingerprint />
        </View>
      </DashboardScreenContainer>
    </ScrollView>
  );
};
