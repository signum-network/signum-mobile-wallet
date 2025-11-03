import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { type TransactionCreation, Steps, StepsAmount } from "../utils/types";
import { router } from "expo-router";
import { AppStepperHeader } from "@/components/AppStepperHeader";

export const FormStepper = () => {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext<TransactionCreation>();
  const activeStep = watch("activeStep");

  const currentStep = activeStep + 1;

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
