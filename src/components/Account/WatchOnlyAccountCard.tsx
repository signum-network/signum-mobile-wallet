import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Text } from "@/components/Text";
import Ionicons from "@expo/vector-icons/Ionicons";

export const WatchOnlyAccountCard = () => {
  const { t } = useTranslation();
  const { iconColor } = useAppTheme();

  return (
    <View className="flex-1 w-full justify-center items-center gap-2 py-8">
      <Ionicons
        name="wallet"
        size={50}
        color={iconColor.default}
        className="opacity-50"
      />

      <Text className="max-w-xs w-full text-center font-medium" size="large">
        {t("watchOnlyAccount.title")}
      </Text>

      <View className="gap-4 flex flex-col items-center justify-center">
        <Text className="text-center" color="muted">
          {t("watchOnlyAccount.description")}
        </Text>
      </View>
    </View>
  );
};
