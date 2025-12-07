import { View } from "react-native";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { useAppTheme } from "@/hooks/useAppTheme";
import { generateSeed, pickRandomKeySeedIndex } from "@/utils/sec/generateSeed";
import { generateSecretKeys } from "@/utils/sec/handleSecretKeys";
import { downloadSeed } from "@/utils/sec/downloadSeed";
import { buildQrSvg } from "@/utils/sec/qrSvg";
import { Address } from "@signumjs/core";
import type { AccountCreation } from "../../utils/types";
import * as Clipboard from "expo-clipboard";
import Ionicons from "@expo/vector-icons/Ionicons";

export const SecretPhraseGeneration = () => {
  const { t } = useTranslation();
  const { iconColor, tokens } = useAppTheme();
  const { watch, setValue } = useFormContext<AccountCreation>();

  const seedPhrase = watch("seedPhrase");

  const generateSeedPhrase = () => {
    const randomIndex = pickRandomKeySeedIndex();
    const passphrase = generateSeed();

    if (!passphrase) return alert("Error: Passphrase Generation");

    setValue("seedPhrase", passphrase);
    setValue("seedPhraseVerificationIndex", randomIndex);
  };

  const copyToClipboard = async () => {
    if (!seedPhrase) return;
    await Clipboard.setStringAsync(seedPhrase);
    alert(t("accountWizard.createAccount.copiedSeedPhrase"));
  };

  const download = () => {
    if (!seedPhrase) return alert("QR generation error");
    // Build crisp SVG once here (no refs needed)
    const { moduleCount, paths } = buildQrSvg(seedPhrase, "M");
    const { publicKey } = generateSecretKeys(seedPhrase);
    const accountAddress =
      Address.fromPublicKey(publicKey).getReedSolomonAddress() || "";

    downloadSeed({
      seed: seedPhrase,
      accountAddress,
      title: t("accountWizard.createAccount.secondStepTitle"),
      description: t(
        "accountWizard.createAccount.secretPhraseCreationDescription"
      ),
      secondDescription: t(
        "accountWizard.createAccount.secretPhraseCreationSecondDescription"
      ),
      qrCodePaths: paths,
      moduleCount, // <<-- used for pixel-perfect sizing + quiet zone
      quietZoneModules: 4, // <<-- standard
      moduleSizePx: 7, // <<-- print-friendly size (252/294/... px)
    });
  };

  useEffect(() => {
    generateSeedPhrase();
  }, []);

  return (
    <View className="flex justify-center items-center gap-4 pt-8 w-full">
      <Text size="extraLarge" className="font-bold text-center">
        {t("accountWizard.createAccount.secondStepTitle")}
      </Text>

      <Text size="large" color="muted" className="text-center">
        {t("accountWizard.createAccount.secondStepDescription")}
      </Text>

      <View className="flex-row items-center justify-center">
        <View
          style={{
            transform: [{ rotate: "180deg" }],
            marginRight: 8,
          }}
        >
          <Ionicons name="triangle" size={18} color={tokens.primary} />
        </View>

        <Text size="large" color="content" className="text-center font-bold">
          {t("accountWizard.createAccount.secondStepSeedPhraseTip")}
        </Text>

        <View
          style={{
            transform: [{ rotate: "180deg" }],
            marginLeft: 8,
          }}
        >
          <Ionicons name="triangle" size={18} color={tokens.primary} />
        </View>
      </View>

      <View
        className="p-4 py-6 w-full rounded-md border"
        style={{
          backgroundColor: tokens.surface,
          borderColor: tokens.border,
        }}
      >
        <Text size="extraLarge">
          {seedPhrase ? seedPhrase : t("loading") + "..."}
        </Text>
      </View>
      <View className="flex flex-col justify-center w-full gap-4 items-center px-8 pt-4">
        <Button
          icon={<Ionicons name="copy" size={24} color={iconColor.default} />}
          type="secondary"
          title={t("copyToClipboard")}
          size="medium"
          fullWidth
          pressableProps={{ onPress: copyToClipboard }}
          disabled={!seedPhrase}
        />
        <Text color="muted">{t("or")}</Text>
        <Button
          icon={<Ionicons name="cloud-download" size={24} color={iconColor.blackout} />}
          type="blackout"
          title={t("download")}
          size="medium"
          fullWidth
          pressableProps={{ onPress: download }}
          disabled={!seedPhrase}
        />
      </View>
      <Text className="text-center pb-20">
        {t("accountWizard.createAccount.secondStepSeedPhraseSecondTip")}
      </Text>
    </View>
  );
};
