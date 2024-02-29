import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text } from "@/components/Text";
import { AccountWizardContainer } from "../components/AccountWizardContainer";

export const ImportScreen = () => {
  const { t } = useTranslation();

  return (
    <AccountWizardContainer>
      <View className="flex flex-1 flex-col justify-around gap-8">
        <Text>I am importing an account</Text>
      </View>
    </AccountWizardContainer>
  );
};
