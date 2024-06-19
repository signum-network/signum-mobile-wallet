import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { asRSAddress } from "@/utils/account/asRSAddress";
import type { TransactionCreation } from "../utils/types";

export const ResolvedAccountCard = () => {
  const { t } = useTranslation();
  const { watch } = useFormContext<TransactionCreation>();

  const recipient = watch("recipient");

  const resolvedAccount = useMemo(() => {
    if (!recipient.trim()) return "";

    try {
      let accountId = recipient;

      return asRSAddress(accountId);
    } catch (error) {
      return "";
    }
  }, [recipient]);

  if (recipient === "0" || recipient.includes("2222-2222-2222-2222")) {
    return (
      <Card>
        <Text fullWidth color="primary">
          {t("transfer.recipientBurnAddress")} 🔥
        </Text>

        <Text fullWidth color="muted">
          {t("transfer.recipientBurnAddressHint")}
        </Text>
      </Card>
    );
  }

  return !!resolvedAccount ? (
    <Card>
      <Text fullWidth color="primary">
        {t("transfer.resolvedRecipientAddress", {
          address: resolvedAccount,
        })}
      </Text>

      <Text fullWidth color="muted">
        {t("transfer.resolvedRecipientAddressHint")} 😁
      </Text>
    </Card>
  ) : null;
};
