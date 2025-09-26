import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { type AccountCreation, Steps, StepsAmount } from "../utils/types";
import { router } from "expo-router";
import { useAccountStore } from "@/hooks/useAccountStore";
import { AppStepperHeader } from "@/components/AppStepperHeader";

export const FormStepper = () => {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext<AccountCreation>();
  const activeStep = watch("activeStep");

  const currentStep = activeStep + 1;

  const stepTitle = useMemo(() => {
    switch (activeStep) {
      case Steps.AccountCreationAgreement:
        return t("accountWizard.createAccount.stepper.agreementStepTitle");

      case Steps.SecretPhraseGeneration:
        return t(
          "accountWizard.createAccount.stepper.secretPhraseGenerationTitle"
        );

      case Steps.SecretPhraseVerification:
        return t(
          "accountWizard.createAccount.stepper.secretPhraseVerificationTitle"
        );

      // Steps Activation
      default:
        return t("accountWizard.createAccount.stepper.accountActivationTitle");
    }
  }, [activeStep]);

  const { isAccountEnrolled } = useAccountStore();

  const goBackwards = () => {
    if (activeStep === Steps.AccountCreationAgreement) {
      if (!isAccountEnrolled) {
        router.replace("/account-wizard");
        return;
      }
      router.replace("/dashboard/account");
    } else {
      setValue("activeStep", activeStep - 1);
    }
  };

  return (
    <AppStepperHeader
      title={t("accountWizard.quickStart.createCta")}
      currentStep={currentStep}
      stepsAmount={StepsAmount}
      onBack={goBackwards}
    />
  );
};
