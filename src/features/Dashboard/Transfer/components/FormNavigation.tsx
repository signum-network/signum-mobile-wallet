import { useMemo } from "react";
import { Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { useWalletAccount } from "@/hooks/useWalletAccount";
import { FormNavButton } from "@/components/Form/NavButton";
import { asAddress } from "@/utils/account/asAddress";
import { getAccountPublicKey } from "@/utils/account/getAccountPublicKey";
import { type TransactionCreation, Steps, maxMemoLength } from "../utils/types";
import { PUBLIC_RESERVED_SIGNA_FOR_TX_FEE } from "@/types/constants";

export const FormNavigation = () => {
  const { t } = useTranslation();
  const {
    accountId,
    accountData: { balance },
  } = useWalletAccount();
  const { watch, setValue } = useFormContext<TransactionCreation>();

  const activeStep = watch("activeStep");
  const recipient = watch("recipient");
  const amount = watch("amount");
  const maxAmount = watch("maxAmount");
  const includeMemo = watch("includeMemo");
  const memo = watch("memo");
  const fee = watch("fee");

  const isRecipientBurningAddress =
    recipient === "0" || recipient.includes("2222-2222-2222-2222");

  const canCompleteFirstStep = recipient || isRecipientBurningAddress;

  const isAssetSigna = watch("asset") === "0";
  const amountNum = Number(amount) || 0;
  const maxNum = Number(maxAmount) || 0;

  const available = Math.max(
    maxNum - (isAssetSigna ? PUBLIC_RESERVED_SIGNA_FOR_TX_FEE : 0),
    0
  );

  const signaAvailableBalance =
    balance?.availableBalance?.getSigna
      ? Number(balance.availableBalance.getSigna())
      : 0;
  const hasFeeFunds =
    isAssetSigna || signaAvailableBalance >= PUBLIC_RESERVED_SIGNA_FOR_TX_FEE;

  const EPS = 1e-8;
  const canCompleteSecondStep = amountNum > 0 && amountNum - available <= EPS && hasFeeFunds;

  const canCompleteThirdStep =
    !includeMemo ||
    !!(includeMemo && memo.trim() && memo.length <= maxMemoLength);
  const canCompleteFourthStep = !!fee;

  const getRecipientValidity = async () => {
    if (isRecipientBurningAddress)
      return setValue("activeStep", Steps.HoldingsSelection);

    try {
      const recipientAccountID = asAddress(recipient).getNumericId();

      if (accountId === recipientAccountID) {
        return Alert.alert(`${t("transfer.yourSelfRecipientHint")} 😉`);
      }

      await getAccountPublicKey(recipientAccountID);

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
            onPress: () => setValue("activeStep", Steps.MemoOptions),
          },
        };

      case Steps.MemoOptions:
        return {
          disabled: !canCompleteThirdStep,
          pressableProps: {
            onPress: () => setValue("activeStep", Steps.FeeSelection),
          },
        };

      case Steps.FeeSelection:
        return {
          disabled: !canCompleteFourthStep,
          pressableProps: {
            onPress: () => setValue("activeStep", Steps.Confirmation),
          },
        };

      // Steps.Confirmation
      default:
        return {
          disabled: true,
        };
    }
  }, [
    activeStep,
    canCompleteFirstStep,
    canCompleteSecondStep,
    canCompleteThirdStep,
    canCompleteFourthStep,
  ]);

  return (
    <FormNavButton
      bottomOffset={0}
      type="primary"
      title={t("continue")}
      hidden={activeStep === Steps.Confirmation}
      {...FormNavButtonProps}
    />
  );
};
