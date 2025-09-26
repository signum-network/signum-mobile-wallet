import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { type TransactionCreation, Steps, StepsAmount } from "../utils/types";
import { useAppTheme } from "@/hooks/useAppTheme";
import { router } from "expo-router";
import { AppStepperHeader } from "@/components/AppStepperHeader";

export const FormStepper = () => {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const { watch, setValue } = useFormContext<TransactionCreation>();
  const activeStep = watch("activeStep");

  const isRecipientStep = activeStep === Steps.Recipient;
  const currentStep = activeStep + 1;

  const stepTitle = useMemo(() => {
    switch (activeStep) {
      case Steps.Recipient:
        return t("transfer.stepper.recipientStepTitle");

      case Steps.HoldingsSelection:
        return t("transfer.stepper.holdingsStepTitle");

      case Steps.MemoOptions:
        return t("transfer.stepper.memoStepTitle");

      case Steps.FeeSelection:
        return t("transfer.stepper.feeSelectionStepTitle");

      // Steps.Confirmation
      default:
        return t("transfer.stepper.confirmationStepTitle");
    }
  }, [activeStep]);

  const goBackwards = () => {
    if (activeStep === Steps.Recipient) {
      router.replace("/dashboard/overview");
    } else {
      setValue("activeStep", activeStep - 1);
    }
  };

  return (
    <AppStepperHeader
      title={t("transfer.title")}
      currentStep={currentStep}
      stepsAmount={StepsAmount}
      onBack={goBackwards}
    />
  );
};
