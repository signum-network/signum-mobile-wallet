import { View, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { useAppTheme } from "@/hooks/useAppTheme";
import type { ThemeDesign } from "@/theme/tokens";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Props {
  id: ThemeDesign;
}

export const DesignCard = ({ id }: Props) => {
  const { t } = useTranslation();
  const { themeDesign, setThemeDesign, iconColor } = useAppTheme();

  const isCurrentDesign = themeDesign === id;

  const handlePress = () => {
    if (!isCurrentDesign) {
      setThemeDesign(id);
    }
  };

  const titleKey = `settings.design.${id}.title`;
  const descriptionKey = `settings.design.${id}.description`;

  return (
    <Pressable
      onPress={handlePress}
      className="w-full rounded-lg active:opacity-80 ripple-[#333] ripple-bordered"
    >
      <Card active={isCurrentDesign}>
        <View className="h-20 w-full flex flex-row justify-between items-center">
          <View className="flex flex-1 gap-1 items-start justify-center">
            <Text className="font-medium" size="large">
              {t(titleKey, id)}
            </Text>
            <Text color="muted" size="small">
              {t(descriptionKey, "")}
            </Text>
          </View>
          <View className="w-20 flex flex-col items-center justify-center">
            {isCurrentDesign && (
              <>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={iconColor.green}
                />
                <Text color="success" className="font-bold" size="small">
                  {t("settings.design.active", "Active")}
                </Text>
              </>
            )}
          </View>
        </View>
      </Card>
    </Pressable>
  );
};
