import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text } from "@/components/Text";

export const CreateScreen = () => {
  const { t } = useTranslation();

  return (
    <View className="flex flex-1 flex-col justify-around gap-8">
      <Text>Hello World</Text>
    </View>
  );
};
