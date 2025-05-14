import { View } from "react-native";
import { useRef, useEffect, useMemo, type RefObject } from "react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { useAppTheme } from "@/hooks/useAppTheme";
import { generateSeed, pickRandomKeySeedIndex } from "@/utils/sec/generateSeed";
import { generateSecretKeys } from "@/utils/sec/handleSecretKeys";
import { downloadSeed } from "@/utils/sec/downloadSeed";
import { Address } from "@signumjs/core";
import type { AccountCreation } from "../../utils/types";
import * as Clipboard from "expo-clipboard";
import QRCode from "react-qr-code";
import Ionicons from "@expo/vector-icons/Ionicons";

export const SecretPhraseGeneration = () => {
  const { t } = useTranslation();
  const { iconColor } = useAppTheme();
  const { watch, setValue } = useFormContext<AccountCreation>();

  const QrCodeRef: RefObject<QRCode> & RefObject<SVGSVGElement> = useRef(null);

  const seedPhrase = watch("seedPhrase");

  const generateSeedPhrase = () => {
    const randomIndex = pickRandomKeySeedIndex();
    const passphrase = generateSeed();

    if (!passphrase) return alert("Error: Passphrase Generation");

    setValue("seedPhrase", passphrase);
    setValue("seedPhraseVerificationIndex", randomIndex);
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(seedPhrase).then(() =>
      alert(t("accountWizard.createAccount.copiedSeedPhrase"))
    );
  };

  // Fun topic to share: I Had to convert React Native SVG to a HTML Compatible SVG in order to allow the user to download the QR Code
  const qrCodePrintPaths = useMemo(() => {
    if (!seedPhrase || !QrCodeRef.current?.props?.children) return "";

    const paths: string[] = [];

    // @ts-ignore
    QrCodeRef.current.props.children.forEach((children) => {
      if (!children || !children.props) return;

      const { d, fill } = children.props;

      paths.push(`
      <path d='${d}' fill='${fill}' />
      `);
    });

    return paths.join("");
  }, [seedPhrase, QrCodeRef, QrCodeRef.current?.props?.children]);

  const download = () => {
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
      qrCodePaths: qrCodePrintPaths,
    });
  };

  useEffect(() => {
    generateSeedPhrase();
  }, []);

  return (
    <View className="flex justify-center items-center gap-4 pt-8">
      <Text size="extraLarge" className="font-bold text-center">
        {t("accountWizard.createAccount.secondStepTitle")}
      </Text>

      <Text size="large" color="muted" className="text-center">
        {t("accountWizard.createAccount.secondStepDescription")}
      </Text>

      <Text size="large" className="text-center font-bold">
        🔻 {t("accountWizard.createAccount.secondStepSeedPhraseTip")} 🔻
      </Text>

      <View className="p-4 py-6 w-full bg-card-foreground dark:bg-card-foreground-dark border border-card-border dark:border-card-border-dark rounded-md">
        <Text size="extraLarge">
          {seedPhrase ? seedPhrase : t("loading") + "..."}
        </Text>
      </View>

      <View className="hidden h-0 overflow-hidden">
        <QRCode
          size={0}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={seedPhrase}
          viewBox="0 0 50 50"
          ref={QrCodeRef}
        />
      </View>

      <View className="flex flex-col justify-center w-full gap-4 items-center px-8">
        <Button
          icon={<Ionicons name="copy" size={24} color="white" />}
          type="secondary"
          title={t("copyToClipboard")}
          fullWidth
          pressableProps={{ onPress: copyToClipboard }}
          disabled={!seedPhrase}
        />

        <Text color="muted">{t("or")}</Text>

        <Button
          icon={
            <Ionicons
              name="cloud-download"
              size={24}
              color={iconColor.blackout}
            />
          }
          type="blackout"
          title={t("download")}
          fullWidth
          pressableProps={{ onPress: download }}
          disabled={!seedPhrase}
        />
      </View>

      <Text className="text-center">
        {t("accountWizard.createAccount.secondStepSeedPhraseSecondTip")}
      </Text>
    </View>
  );
};
