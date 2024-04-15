import { View, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { appStore } from "@/states/appStore";
import type { locales } from "@/locales";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Props {
  lng: locales;
  label: string;
}

export const LanguageCard = ({ lng, label }: Props) => {
  const { t } = useTranslation();
  const language = appStore((state) => state.language);
  const setLanguage = appStore((state) => state.setLanguage);

  const changeLanguage = () => {
    setLanguage(lng);
  };

  const isCurrentLanguage = language === lng;

  return (
    <Pressable
      onPress={changeLanguage}
      className="w-full rounded-lg active:opacity-80 ripple-[#333] ripple-bordered"
    >
      <Card>
        <View className="w-full flex flex-row justify-between items-center">
          <View className="flex flex-row gap-1 items-center justify-start">
            <Text className="font-medium" size="large">
              {label}
            </Text>

            <Text color="muted" size="large">
              {lng.toUpperCase()}
            </Text>
          </View>

          {isCurrentLanguage && (
            <View className="flex flex-col items-center justify-center">
              <Ionicons name="checkbox" size={36} color="green" />

              <Text color="success" className="font-bold" size="small">
                {t("settings.account.active")}
              </Text>
            </View>
          )}
        </View>
      </Card>
    </Pressable>
  );
};
