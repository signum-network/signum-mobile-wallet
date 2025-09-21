import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { View, Pressable } from "react-native";
import { useFormContext } from "react-hook-form";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { type TransactionCreation, Steps, StepsAmount } from "../utils/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppTheme } from "@/hooks/useAppTheme";
import { router } from "expo-router";

export const FormStepper = () => {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const { watch, setValue } = useFormContext<TransactionCreation>();
  const activeStep = watch("activeStep");

  const isRecipientStep = activeStep === Steps.Recipient;
  const currentStep = activeStep + 1;

  const title = useMemo(() => {
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
    <View className="w-full px-4 pt-4 gap-4">
      <Pressable
        className="w-full rounded-lg active:opacity-80 ripple-[#333] ripple-bordered"
        onPress={goBackwards}
      >
        <Card>
          <View className="w-full flex flex-row items-center justify-between">
            <Ionicons name="arrow-back" size={28} color={theme.colors.text} style={{ marginRight: 16 }}  />
            <View className="w-14 h-14 rounded-full border border-card-border dark:border-card-border-dark flex justify-center items-center">
              <Text size="large" color="muted" className="font-bold">
                {currentStep}/{StepsAmount}
              </Text>
            </View>

            <View className="flex-1 flex flex-col items-end justify-end">
              <Text size="large" color="muted" className="font-bold">
                {title}
              </Text>

              
                <Text color="muted" size="small">
                  {t("transfer.stepper.goBackwards")}
                </Text>
              
            </View>
          </View>
        </Card>
      </Pressable>
    </View>
  );
};
