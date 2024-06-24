import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { useAccount } from "@/hooks/useAccount";
import { useLedgerService } from "@/hooks/useLedgerService";
import { FormNavButton } from "@/components/Form/NavButton";
import { asAddress } from "@/utils/account/asAddress";
import { type TransactionCreation, Steps } from "../utils/types";

interface Props {
  onSubmit: () => void;
}

export const FormNavigation = ({ onSubmit }: Props) => {
  const { t } = useTranslation();
  const { accountId } = useAccount();
  const { ledgerService } = useLedgerService();
  const { watch, setValue } = useFormContext<TransactionCreation>();

  const activeStep = watch("activeStep");
  const recipient = watch("recipient");
  const amount = watch("amount");
  const maxAmount = watch("maxAmount");

  const isRecipientBurningAddress =
    recipient === "0" || recipient.includes("2222-2222-2222-2222");

  const canCompleteFirstStep = recipient || isRecipientBurningAddress;
  const canCompleteSecondStep = amount && amount <= maxAmount;

  const getRecipientValidity = async () => {
    if (!ledgerService) return;

    if (isRecipientBurningAddress)
      return setValue("activeStep", Steps.HoldingsSelection);

    try {
      const recipientAccountID = asAddress(recipient).getNumericId();

      if (accountId === recipientAccountID)
        return alert(t("transfer.yourSelfRecipientHint"));

      await ledgerService.account.fetchAccountPublicKey(recipientAccountID);

      setValue("activeStep", Steps.HoldingsSelection);
    } catch (error) {
      return alert(t("accountDoesNotExists"));
    }
  };

  const FormNavButtonProps = useMemo(() => {
    switch (activeStep) {
      case Steps.Recipient:
        return {
          disabled: !canCompleteFirstStep,
          pressableProps: {
            onPress: getRecipientValidity,
          },
        };

      case Steps.HoldingsSelection:
        return {
          disabled: !canCompleteSecondStep,
          pressableProps: {
            onPress: () => {},
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
  }, [activeStep, canCompleteFirstStep, canCompleteSecondStep]);

  return (
    <FormNavButton
      type="primary"
      title={t("continue")}
      {...FormNavButtonProps}
    />
  );
};
