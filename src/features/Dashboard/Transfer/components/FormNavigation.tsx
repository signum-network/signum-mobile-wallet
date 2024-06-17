import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { FormNavButton } from "@/components/Form/NavButton";
import { type TransactionCreation, Steps } from "../utils/types";

interface Props {
  onSubmit: () => void;
}

export const FormNavigation = ({ onSubmit }: Props) => {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext<TransactionCreation>();

  const activeStep = watch("activeStep");
  const recipient = watch("recipient");
  const isRecipientValid = watch("isRecipientValid");

  const canCompleteFirstStep =
    (recipient && isRecipientValid) || recipient === "0";

  const FormNavButtonProps = useMemo(() => {
    switch (activeStep) {
      case Steps.Recipient:
        return {
          disabled: !canCompleteFirstStep,
          pressableProps: {
            onPress: () => {
              setValue("activeStep", Steps.HoldingsSelection);
            },
          },
        };

      // Steps.Confirmation
      default:
        return {
          disabled: true,
          pressableProps: {
            onPress: () => {
              onSubmit();
            },
          },
        };
    }
  }, [activeStep, canCompleteFirstStep]);

  return (
    <FormNavButton
      type="primary"
      title={t("continue")}
      {...FormNavButtonProps}
    />
  );
};
