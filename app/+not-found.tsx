import { Stack } from "expo-router";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { useAppTheme } from "@/hooks/useAppTheme";

export default function NotFoundScreen() {
  const { t } = useTranslation();
  const { iconColor, tokens } = useAppTheme();

  return (
    <>
      <Stack.Screen options={{ title: t("notFound.title") }} />
      <View
        style={{ flex: 1, backgroundColor: tokens.background }}
        className="flex-1"
      >
        <View
          className="flex-1 justify-center items-center p-5"
        >
          <View className="flex flex-col items-center justify-center gap-6 w-full max-w-md">
            <View className="flex items-center justify-center mb-2">
              <Ionicons
                name="compass-outline"
                size={80}
                color={iconColor.primary}
              />
            </View>

            <Text size="2large" className="font-bold text-center">
              {t("notFound.title")}
            </Text>

            <Text size="medium" className="text-center" color="muted">
              {t("notFound.description")}
            </Text>

            <View className="w-full flex flex-col gap-3 mt-4">
              <Button
                icon={<Ionicons name="home" size={24} color="white" />}
                title={t("notFound.goHome")}
                type="primary"
                linkProps={{ href: "/" }}
                fullWidth
              />
            </View>
          </View>
        </View>
      </View>
    </>
  );
}
