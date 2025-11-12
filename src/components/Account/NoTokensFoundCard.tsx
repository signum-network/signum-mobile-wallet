import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Text } from "@/components/Text";
import Ionicons from "@expo/vector-icons/Ionicons";

export const NoTokensFoundCard = () => {
  const { t } = useTranslation();
  const { iconColor } = useAppTheme();

  return (
    <View className="flex-1 justify-center items-center gap-2 py-8 w-full">
      <Ionicons
        name="barcode-outline"
        size={50}
        color={iconColor.default}
        className="opacity-50"
      />

      <Text className="max-w-xs w-full text-center font-medium" size="large">
        {t("overview.tokens.noTokenFoundTitle")}
      </Text>

      <View className="gap-4 flex flex-col items-center justify-center">
        <Text className="text-center" color="muted">
          {t("overview.tokens.noTokenFoundDescription")}
        </Text>
      </View>
    </View>
  );
};
