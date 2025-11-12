import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export const NoCommitment = () => {
  const { t } = useTranslation();
  const { iconColor } = useAppTheme();

  return (
    <Card>
      <View className="flex-1 justify-center items-center gap-2 py-8 w-full">
        <MaterialCommunityIcons
          name="harddisk"
          size={50}
          color={iconColor.default}
          className="opacity-50"
        />

        <Text className="max-w-xs w-full text-center font-medium" size="large">
          {t("commitment.noCommitment")}
        </Text>

        <View className="gap-4 flex flex-col items-center justify-center">
          <Text className="text-center" color="muted">
            {t("commitment.noCommitmentDescription")}
          </Text>
        </View>
      </View>
    </Card>
  );
};
