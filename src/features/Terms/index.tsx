import { useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { LICENSE } from "./utils/License";
import { Button } from "@/components/Button";
import { signumWhiteSymbolPicture } from "@/assets";
import { Text } from "@/components/Text";
import { FormCheckbox } from "@/components/FormCheckbox";
import { useAppStore } from "@/hooks/useAppStore";

import Markdown from "react-native-marked";

export const TermsScreen = () => {
  const { t } = useTranslation();
  const { setIsTermAgreed } = useAppStore();
  const [accepted, setAccepted] = useState(false);
  const toggleTerms = () => setAccepted(!accepted);
  const router = useRouter();

  const saveTerms = () => {
    setIsTermAgreed(true);
    router.replace("/auth/enroll");
  };

  return (
    <View className="flex-1 bg-white gap-4">
      <View className="items-center justify-center bg-signum pt-8 pb-4 gap-4">
        <Image
          source={{ uri: signumWhiteSymbolPicture }}
          style={{ width: 96, height: 96 }}
        />

        <Text className="text-white font-bold text-3xl">{t("welcome")}</Text>
      </View>

      <View style={{ flex: 1 }} className="px-4 gap-4">
        <View>
          <Text size="large" color="muted" className="text-center font-medium">
            {t("terms.requestFirstLine")}
          </Text>

          <Text size="large" color="muted" className="text-center font-medium">
            {t("terms.requestSecondLine")}
          </Text>
        </View>

        <View className="p-2 border border-card-border dark:border-card-border-dark rounded-md flex-1">
          <Markdown value={LICENSE} />
        </View>
      </View>

      <View className="flex items-center p-4 gap-4 color-slate-500">
        <FormCheckbox
          value={accepted}
          title={t("terms.acceptTerms")}
          onPress={toggleTerms}
          bordered
          fullWidth
        />

        <Button
          type="primary"
          title={t("continue")}
          disabled={!accepted}
          fullWidth
          pressableProps={{ onPress: saveTerms }}
        />
      </View>
    </View>
  );
};
