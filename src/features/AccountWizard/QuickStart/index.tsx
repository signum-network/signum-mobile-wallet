import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { Image } from "expo-image";
import { Text } from "@/components/Text";
import { Ionicons } from "@expo/vector-icons";
import { wizardBannerPicture } from "@/assets";
import { Button } from "@/components/Button";
import { useAppTheme } from "@/hooks/useAppTheme";
import { AccountWizardContainer } from "../components/AccountWizardContainer";

export const QuickStartScreen = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useAppTheme();

  return (
    <AccountWizardContainer>
      <View className="flex flex-1 flex-col justify-around gap-8">
        <View className="items-center justify-center gap-4">
          <Image
            source={{ uri: wizardBannerPicture }}
            style={{ width: 274, height: 204 }}
          />

          <Text className="font-bold" size="extraLarge">
            {t("accountWizard.quickStart.title")}
          </Text>
          <Text className="text-center max-w-sm" size="large">
            {t("accountWizard.quickStart.description")}
          </Text>
        </View>

        <View className="items-center justify-center gap-4">
          <Text className="text-center max-w-xs" color="muted" size="large">
            {t("accountWizard.quickStart.ctaTitle")}
          </Text>

          <Button
            fullWidth
            wide
            title={t("accountWizard.quickStart.createCta")}
            type="primary"
            size="large"
            icon={<Ionicons name="add-circle" size={24} color="white" />}
            linkProps={{ href: "/account-wizard/create", replace: false }}
          />

          <Text color="muted">{t("or")}</Text>

          <Button
            fullWidth
            wide
            title={t("accountWizard.quickStart.importCta")}
            type="blackout"
            size="large"
            icon={
              <Ionicons
                name="refresh-sharp"
                size={24}
                color={isDarkMode ? "black" : "white"}
              />
            }
            linkProps={{ href: "/account-wizard/import" }}
          />
        </View>
      </View>
    </AccountWizardContainer>
  );
};
