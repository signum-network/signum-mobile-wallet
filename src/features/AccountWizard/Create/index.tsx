import { useState, useRef, useEffect, type RefObject } from "react";
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

export const CreateScreen = () => {
  const { t } = useTranslation();
  const {
    accountWalletNames,
    addAccount,
    setActiveAccount,
    updateAccountPublicKeyActivationStatus,
  } = useAccountStore();

  const { ledgerService } = useLedgerService();
  const { currentNetwork } = useNodeHostStore();

  const [showDialog, setShowDialog] = useState(false);

  const scrollRef: RefObject<ScrollView> = useRef(null!);

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

  useEffect(() => {
    if (!scrollRef.current) return;

    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }, [activeStep]);

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

      router.replace("/dashboard/account");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider {...methods}>
      <FormNavigation onSubmit={methods.handleSubmit(onSubmit)} />
      <FormStepper />
      <KeyboardAnimatedContainer>
        <Dialog variant="full" visible={showDialog}>
          <View className="flex flex-col items-center justify-center gap-4 w-full">
            <Ionicons name="checkmark-circle" size={85} color="green" />

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

        <ScrollView ref={scrollRef}>
          <AccountWizardContainer>
            {activeStep === Steps.AccountCreationAgreement && (
       
                <Agreement />

            )}

            {activeStep === Steps.SecretPhraseGeneration && (

                <SecretPhraseGeneration />
 
            )}

            {activeStep === Steps.SecretPhraseVerification && (
  
                <SecretPhraseVerification />
          
            )}
          </AccountWizardContainer>
        </ScrollView>
      </KeyboardAnimatedContainer>
    </FormProvider>
  );
};
