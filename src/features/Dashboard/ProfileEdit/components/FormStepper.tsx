import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { type ProfileEdit, Steps, StepsAmount } from "../utils/types";
import { router } from "expo-router";
import { AppStepperHeader } from "@/components/AppStepperHeader";

export const FormStepper = () => {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext<ProfileEdit>();
  const activeStep = watch("activeStep");

  const goBackwards = () => {
    if (activeStep === Steps.ProfileForm) {
      router.back();
    } else {
      setValue("activeStep", Math.max(0, activeStep - 1));
    }
  };

  return (
    <AppStepperHeader
      title={t("profile.editProfile")}
      currentStep={activeStep}
      stepsAmount={StepsAmount - 1}
      onBack={goBackwards}
    />
  );
};
