import { ScrollView, View } from "react-native";
import { KeyboardAvoidingView } from "@/components/Form/KeyboardAvoidingView";
import { DashboardScreenContainer } from "../components/DashboardScreenContainer";
import { Balance } from "./sections/Balance";
import { Operation } from "./sections/Operation";

export const CommitmentScreen = () => (
  <KeyboardAvoidingView>
    <ScrollView>
      <DashboardScreenContainer>
        <View className="flex flex-col items-start justify-center w-full px-4 pt-4 pb-20 gap-4">
          <Balance />
          <Operation />
        </View>
      </DashboardScreenContainer>
    </ScrollView>
  </KeyboardAvoidingView>
);
