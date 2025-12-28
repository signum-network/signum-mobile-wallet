import { View } from "react-native";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text } from "@/components/Text";

export const BurnWarning = () => {
  const { t } = useTranslation();

  return (
    <View className="w-full border-2 rounded-xl p-4 bg-red-400/10" style={{ borderColor: "#FF6B35" }}>
      <View className="flex flex-row items-start gap-3 w-full">
        <Ionicons name="warning" size={32} color="#FF6B35" />
        <View className="flex-1 flex-shrink">
          <Text size="medium" className="font-bold" style={{ color: "#FF6B35" }}>
            {t("transfer.burnWarningTitle")}
          </Text>
          <Text size="small" color="muted" className="mt-1">
            {t("transfer.burnWarningDescription")}
          </Text>
        </View>
      </View>
    </View>
  );
};
