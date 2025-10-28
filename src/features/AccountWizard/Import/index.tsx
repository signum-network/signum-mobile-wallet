import { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { useForm, FormProvider, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { BarcodeScanningResult } from "expo-camera";
import { accountImportSchema } from "./utils/schemas";
import type { AccountImport } from "./utils/types";
import { AccountWizardContainer } from "../components/AccountWizardContainer";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAccountStore } from "@/hooks/useAccountStore";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { AccountType } from "@/types/account";
import { HorizontalDivider } from "@/components/HorizontalDivider";
import { CameraDialog } from "@/components/CameraDialog";
import { getAccountPublicKey } from "@/utils/account/getAccountPublicKey";
import { FormNavigation } from "./components/FormNavigation";
import { WalletNameField } from "./sections/WalletNameField";
import { SeedPhraseField } from "./sections/SeedPhraseField";
import { AccountIdField } from "./sections/AccountIdField";
import {
  generateSecretKeys,
  saveSecretKey,
} from "@/utils/sec/handleSecretKeys";
import Ionicons from "@expo/vector-icons/Ionicons";
import { KeyboardAnimatedContainer } from "@/components/KeyboardAnimatedContainer";
import { AppHeader } from "@/components/AppHeader";

export const ImportScreen = () => {
  const { t } = useTranslation();
  const { iconColor } = useAppTheme();
  const {
    accountWalletNames,
    accountPublicKeys,
    addAccount,
    setActiveAccount,
  } = useAccountStore();

  const methods = useForm<AccountImport>({
    mode: "onChange",
    resolver: yupResolver(accountImportSchema),
    defaultValues: {
      type: AccountType.mnemonic,
      account: "",
      isAccountValid: false,
      walletName: "",
      mnemonicAccountAgreement: false,
    },
  });

  const { watch, setValue, resetField, handleSubmit } = methods;

  const type = watch("type");
  const isAccountypeMnemonic = type === AccountType.mnemonic;
  const isAccountypeWatchOnly = type === AccountType.watchOnly;

  const setMnemonicMode = () => setValue("type", AccountType.mnemonic);
  const setWatchOnlyMode = () => setValue("type", AccountType.watchOnly);

  useEffect(() => {
    resetField("account");
    resetField("isAccountValid");
    setValue("mnemonicAccountAgreement", false);
  }, [type]);

  const onCodeScanned = (code: BarcodeScanningResult) => {
    setValue("account", code.data);
  };

  const onSubmit: SubmitHandler<AccountImport> = async (data) => {
    const { walletName, account } = data;

    if (accountWalletNames.includes(walletName.toLowerCase())) {
      return alert(t("accountWizard.walletNameAlreadyUsed"));
    }

    switch (data.type) {
      case AccountType.mnemonic:
        const { publicKey, signPrivateKey, agreementPrivateKey } =
          generateSecretKeys(account);

        if (accountPublicKeys.includes(publicKey)) {
          return alert(
            t("accountWizard.importAccount.importAccountAlreadyExists")
          );
        }

        saveSecretKey(publicKey, signPrivateKey, agreementPrivateKey).then(
          () => {
            addAccount({
              publicKey,
              type: AccountType.mnemonic,
              walletName,
            });

            setActiveAccount(publicKey);

            router.replace("/dashboard/overview");
          }
        );
        break;

      // AccountType.watchOnly
      // Get account request to active node
      default:
        try {
          const watchAccountPublicKey = await getAccountPublicKey(account);

          if (!watchAccountPublicKey) {
            return alert(t("accountDoesNotExists"));
          }

          if (accountPublicKeys.includes(watchAccountPublicKey)) {
            return alert(
              t("accountWizard.importAccount.importAccountAlreadyExists")
            );
          }

          addAccount({
            publicKey: watchAccountPublicKey,
            type: AccountType.watchOnly,
            walletName,
          });

          setActiveAccount(watchAccountPublicKey);

          router.replace("/dashboard/overview");
        } catch (error: any) {
          return alert(t("accountDoesNotExists"));
        }

        break;
    }
  };

  const { isAccountEnrolled } = useAccountStore();
  const goBackwards = () => {
    if (!isAccountEnrolled) {
      router.replace("/account-wizard");
      return;
    } else {
      router.replace("/dashboard/account");
    }
  };

  return (
    <FormProvider {...methods}>
      <FormNavigation onSubmit={handleSubmit(onSubmit)} />

      <AppHeader
        title={t("accountWizard.quickStart.importCta")}
        onBack={goBackwards}
      />

      <KeyboardAnimatedContainer>
        <ScrollView>
          <AccountWizardContainer>
            <View className="flex flex-col items-center justify-center w-full gap-4">
              <Text size="extraLarge" className="font-bold text-center mt-8">
                {t("accountWizard.importAccount.importTitle")}
              </Text>

              <Text size="large" color="muted" className="text-center">
                {t("accountWizard.importAccount.importDescription")}
              </Text>

              <View className="flex flex-row items-stretch gap-2 bg-card-foreground dark:bg-card-foreground-dark border border-card-border dark:border-card-border-dark rounded-full max-w-md w-full p-1 overflow-hidden">
                <Button
                  icon={
                    <Ionicons
                      name="bag-check"
                      size={24}
                      color={isAccountypeMnemonic ? "white" : iconColor.muted}
                    />
                  }
                  type={isAccountypeMnemonic ? "primary" : undefined}
                  title={t("fullAccount")}
                  extraClassNames="flex-1 px-4"
                  size="medium"
                  titleClassName={
                    isAccountypeMnemonic
                      ? "text-white"
                      : "text-muted-foreground dark:text-muted-foreground-dark"
                  }
                  pressableProps={{ onPress: setMnemonicMode }}
                />

                <Button
                  icon={
                    <Ionicons
                      name="eye"
                      size={24}
                      color={isAccountypeWatchOnly ? "white" : iconColor.muted}
                    />
                  }
                  type={isAccountypeWatchOnly ? "primary" : undefined}
                  title={t("watchOnly")}
                  extraClassNames="flex-1 px-4"
                  size="medium"
                  titleClassName={
                    isAccountypeWatchOnly
                      ? "text-white"
                      : "text-muted-foreground dark:text-muted-foreground-dark"
                  }
                  pressableProps={{ onPress: setWatchOnlyMode }}
                />
              </View>

              {type === AccountType.mnemonic && (
                <View className="gap-4 w-full">
                  <Text className="text-center">
                    {t("accountWizard.importAccount.importMnemonicHint")}
                  </Text>
                  <CameraDialog
                    expected={"passphrase"}
                    onCodeScanned={onCodeScanned}
                  />
                  <SeedPhraseField />
                </View>
              )}

              {type === AccountType.watchOnly && (
                <View className="gap-4 w-full">
                  <Text className="text-center">
                    {t("accountWizard.importAccount.importWatchOnlyHint")}
                  </Text>
                  <CameraDialog
                    expected={"address"}
                    onCodeScanned={onCodeScanned}
                  />
                  <AccountIdField />
                </View>
              )}
            </View>

            <HorizontalDivider />

            <WalletNameField />
          </AccountWizardContainer>
        </ScrollView>
      </KeyboardAnimatedContainer>
    </FormProvider>
  );
};
