import { useState } from "react";
import { ScrollView, View, ActivityIndicator } from "react-native";
import { useForm, FormProvider, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "@/components/Dialog";
import { AccountWizardContainer } from "../components/AccountWizardContainer";
import { accountCreationSchema } from "./utils/schemas";
import { Agreement } from "./sections/Agreement";
import { SecretPhraseGeneration } from "./sections/SecretPhraseGeneration";
import { SecretPhraseVerification } from "./sections/SecretPhraseVerification";
import { type AccountCreation, Steps } from "./utils/types";
import { FormNavigation } from "./components/FormNavigation";
import { Text } from "@/components/Text";
import {
  generateSecretKeys,
  saveSecretKey,
} from "@/utils/sec/handleSecretKeys";
import { useAccountStore } from "@/hooks/useAccountStore";
import { AccountType } from "@/types/account";
import Ionicons from "@expo/vector-icons/Ionicons";
import { KeyboardAnimatedContainer } from "@/components/KeyboardAnimatedContainer";
import { FormStepper } from "./components/FormStepper";
import { useLedgerService } from "@/hooks/useLedgerService";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";
import { Address } from "@signumjs/core";
import { PUBLIC_SIGNUM_AVERAGE_BLOCK_TIME_IN_MINUTES } from "@/types/constants";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";



export const CreateScreen = () => {
  const { t } = useTranslation();
  const {
    accountWalletNames,
    isAccountEnrolled,
    addAccount,
    setActiveAccount,
    updateAccountPublicKeyActivationStatus,
  } = useAccountStore();

  const { ledgerService } = useLedgerService();
  const { currentNetwork } = useNodeHostStore();
  const { iconColor } = useAppTheme();
  const [showDialog, setShowDialog] = useState(false);
  const insets = useSafeAreaInsets();

  const methods = useForm<AccountCreation>({
    mode: "onChange",
    resolver: yupResolver(accountCreationSchema),
    defaultValues: {
      activeStep: Steps.AccountCreationAgreement,
      firstTerm: false,
      secondTerm: false,
      thirdTerm: false,
      seedPhrase: "",
      seedPhraseVerificationIndex: 0,
      seedPhraseVerificationWord: "",
      walletName: "",
    },
  });

  const activeStep = methods.watch("activeStep");

  const onSubmit: SubmitHandler<AccountCreation> = async (data) => {
    setShowDialog(true);

    const { seedPhrase, walletName } = data;

    if (accountWalletNames.includes(walletName.toLowerCase())) {
      alert(t("accountWizard.walletNameAlreadyUsed"));
      return setShowDialog(false);
    }

    const { publicKey, signPrivateKey, agreementPrivateKey } =
      generateSecretKeys(seedPhrase);

    try {
      await saveSecretKey(publicKey, signPrivateKey, agreementPrivateKey);

      addAccount({
        publicKey,
        type: AccountType.mnemonic,
        walletName,
      });

      setActiveAccount(publicKey);

      const accountId = Address.fromPublicKey(publicKey).getNumericId();
      if (ledgerService) {
        ledgerService.account.activate(accountId, publicKey).finally(() => {
          alert(
            `${t("unsafeAccount.activating")}\n` +
            t("unsafeAccount.accountActivationIsPending", {
              blocktime: PUBLIC_SIGNUM_AVERAGE_BLOCK_TIME_IN_MINUTES,
            })
          );
          updateAccountPublicKeyActivationStatus(
            publicKey,
            currentNetwork,
            true
          );
        });
      }
      setTimeout(() => {
        requestAnimationFrame(() => {
          router.replace("/dashboard/account");
        });
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider {...methods}>
      <FormStepper />
      <KeyboardAnimatedContainer baseBottom={isAccountEnrolled ? -150 : insets.bottom}>
        <Dialog variant="full" visible={showDialog}>
          <View className="flex flex-col items-center justify-center gap-4 w-full">
            <Ionicons name="checkmark-circle" size={85} color={iconColor.green} />

            <Text className="text-center" size="large">
              {t("accountWizard.createAccount.accountCreated")}
            </Text>

            <Text className="text-center" color="muted">
              {t("accountWizard.createAccount.accountCreatedDescription")} ❤️
            </Text>

            <View className="gap-2 flex flex-row items-center justify-center">
              <ActivityIndicator />
              <Text color="muted">{t("auth.loadingWait")}</Text>
            </View>
          </View>
        </Dialog>
     


        <ScrollView key={activeStep} contentContainerStyle={!isAccountEnrolled ? { paddingBottom: 78 + insets.bottom } : undefined}>
          <AccountWizardContainer>
            {activeStep === Steps.AccountCreationAgreement &&
              <Agreement />}
            {activeStep === Steps.SecretPhraseGeneration && (
              <SecretPhraseGeneration />
            )}
            {activeStep === Steps.SecretPhraseVerification && (
              <SecretPhraseVerification />
            )}
          </AccountWizardContainer>
        </ScrollView>
        </KeyboardAnimatedContainer>
        <FormNavigation onSubmit={methods.handleSubmit(onSubmit)} />
    </FormProvider>
  );
};
