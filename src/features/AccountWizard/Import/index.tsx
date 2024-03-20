import { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useForm, FormProvider, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { type BarcodeScanningResult } from "expo-camera/next";
import { accountImportSchema } from "./utils/schemas";
import type { AccountImport } from "./utils/types";
import { AccountWizardContainer } from "../components/AccountWizardContainer";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAccountStore } from "@/hooks/useAccountStore";
import { useLedgerService } from "@/hooks/useLedgerService";
import { AnimatedSlideContainer } from "@/components/AnimatedSlideContainer";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { AccountType } from "@/types/account";
import { HorizontalDivider } from "@/components/HorizontalDivider";
import { KeyboardAvoidingView } from "@/components/Form/KeyboardAvoidingView";
import { CameraDialog } from "@/components/CameraDialog";
import { FormNavigation } from "./components/FormNavigation";
import { WalletNameField } from "./sections/WalletNameField";
import { SeedPhraseField } from "./sections/SeedPhraseField";
import { AccountIdField } from "./sections/AccountIdField";
import {
  generateSecretKeys,
  saveSecretKey,
} from "@/utils/sec/handleSecretKeys";
import { asAddress } from "@/utils/account/asAddress";

export const ImportScreen = () => {
  const { t } = useTranslation();
  const { iconColor } = useAppTheme();
  const { ledgerService } = useLedgerService();
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

  const { watch, setValue, resetField } = methods;

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

  const onCodeScanned = (data: BarcodeScanningResult) => {
    setValue("account", data.data);
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

            router.replace("/(dashboard)/overview");
          }
        );
        break;

      // AccountType.watchOnly
      // Get account request to active node
      default:
        try {
          if (!ledgerService) return;

          const watchAccountID = asAddress(account).getNumericId();

          const watchAccountPublicKey =
            await ledgerService.account.fetchAccountPublicKey(watchAccountID);

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

          router.replace("/(dashboard)/overview");
        } catch (error: any) {
          return alert(t("accountDoesNotExists"));
        }

        break;
    }
  };

  return (
    <FormProvider {...methods}>
      <FormNavigation onSubmit={methods.handleSubmit(onSubmit)} />

      <KeyboardAvoidingView>
        <ScrollView>
          <AccountWizardContainer>
            <View className="flex flex-col items-center justify-center w-full gap-4">
              <Text size="extraLarge" className="font-bold text-center mt-8">
                {t("accountWizard.importAccount.importTitle")}
              </Text>

              <Text size="large" color="muted" className="text-center">
                {t("accountWizard.importAccount.importDescription")}
              </Text>

              <View className="flex flex-row items-center justify-center bg-card-foreground dark:bg-card-foreground-dark border border-card-border dark:border-card-border-dark rounded-lg max-w-md mx-auto w-full">
                <Button
                  icon={
                    <Ionicons
                      name="bag-check"
                      size={24}
                      color={isAccountypeMnemonic ? "white" : iconColor.default}
                    />
                  }
                  type={isAccountypeMnemonic ? "primary" : undefined}
                  title={t("fullAccount")}
                  extraClassNames="!rounded-r-none w-1/2"
                  size="large"
                  pressableProps={{ onPress: setMnemonicMode }}
                />

                <Button
                  icon={
                    <Ionicons
                      name="eye"
                      size={24}
                      color={
                        isAccountypeWatchOnly ? "white" : iconColor.default
                      }
                    />
                  }
                  type={isAccountypeWatchOnly ? "primary" : undefined}
                  title={t("watchOnly")}
                  extraClassNames="!rounded-l-none w-1/2"
                  size="large"
                  pressableProps={{ onPress: setWatchOnlyMode }}
                />
              </View>

              <Text className="text-center">
                {t(
                  isAccountypeMnemonic
                    ? "accountWizard.importAccount.importMnemonicHint"
                    : "accountWizard.importAccount.importWatchOnlyHint"
                )}
              </Text>

              <CameraDialog onCodeScanned={onCodeScanned} />

              {type === AccountType.mnemonic && (
                <AnimatedSlideContainer>
                  <SeedPhraseField />
                </AnimatedSlideContainer>
              )}

              {type === AccountType.watchOnly && (
                <AnimatedSlideContainer>
                  <AccountIdField />
                </AnimatedSlideContainer>
              )}
            </View>

            <HorizontalDivider />

            <WalletNameField />
          </AccountWizardContainer>
        </ScrollView>
      </KeyboardAvoidingView>
    </FormProvider>
  );
};
