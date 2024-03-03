import { View } from "react-native";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import type { AccountCreationAgreement } from "../../utils/types";
import * as Clipboard from "expo-clipboard";

export const SecretPhraseGeneration = () => {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext<AccountCreationAgreement>();

  const seedPhrase = watch("seedPhrase");

  const generateSeedPhrase = async () => {
    const passphrase =
      "Lorem ipsum dolor sit ame Lorem ipsum dolor sit ame Lorem ipsum dolor sit ame";

    setValue("seedPhrase", passphrase);
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(seedPhrase).then(() =>
      alert(t("copiedSeedPhrase"))
    );
  };

  useEffect(() => {
    (async () => {
      await generateSeedPhrase();
    })();
  }, []);

  return (
    <View className="flex justify-center items-center gap-4 pt-8">
      <Text size="extraLarge" className="font-bold text-center">
        {t("accountWizard.createAccount.secondStepTitle")}
      </Text>

      <Text size="large" color="muted" className="text-center mb-4">
        {t("accountWizard.createAccount.secondStepDescription")}
      </Text>

      <Button
        icon={<Ionicons name="copy" size={24} color="white" />}
        type="secondary"
        title={t("copyToClipboard")}
        size="large"
        wide
        pressableProps={{ onPress: copyToClipboard }}
        disabled={!seedPhrase}
      />

      <View className="my-4 p-4 py-6 w-full border-2 border-card-border dark:border-card-border-dark rounded-md">
        <Text size="extraLarge">
          {seedPhrase ? seedPhrase : t("loading") + "..."}
        </Text>
      </View>

      <Text size="large" className="text-center font-bold">
        🔺{t("accountWizard.createAccount.secondStepSeedPhraseTip")}🔺
      </Text>

      <Text className="text-center">
        {t("accountWizard.createAccount.secondStepSeedPhraseSecondTip")}
      </Text>
    </View>
  );
};
