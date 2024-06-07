import { ScrollView, View } from "react-native";
import { DashboardScreenContainer } from "../components/DashboardScreenContainer";
import { AssetSummary } from "./sections/AssetSummary";
import { AssetList } from "./sections/AssetList";

export const TokensScreen = () => (
  <ScrollView>
    <DashboardScreenContainer>
      <View className="flex flex-col items-start justify-center w-full px-4 pt-4 gap-4">
        <AssetSummary />

        <AssetList />
      </View>
    </DashboardScreenContainer>
  </ScrollView>
);
