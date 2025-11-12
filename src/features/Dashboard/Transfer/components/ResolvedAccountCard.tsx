import { useMemo } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { asAddress } from "@/utils/account/asAddress";
import type { TransactionCreation } from "../utils/types";
import { useAccount } from "@/hooks/useAccount";

interface Props {
  simple?: boolean;
}

export const ResolvedAccountCard = ({ simple }: Props) => {
  const { t } = useTranslation();
  const { watch } = useFormContext<TransactionCreation>();
  const { accountId } = useAccount();

  const recipient = watch("recipient");

  const resolvedAccount = useMemo(() => {
    if (!recipient.trim()) return;

    try {
      let accountId = recipient;
      return asAddress(accountId);
    } catch (error) {
      return;
    }
  }, [recipient]);

  if (recipient === "0" || recipient.includes("2222-2222-2222-2222")) {
    return (
      <Card>
        <View className="gap-1 w-full">
          <Text fullWidth color="primary">
            {t("transfer.recipientBurnAddress")} 🔥
          </Text>

          <Text fullWidth color="muted">
            {t("transfer.recipientBurnAddressHint")}
          </Text>
        </View>
      </Card>
    );
  } else if (resolvedAccount && resolvedAccount.getNumericId() === accountId) {
    return (
      <Card>
        <View className="w-full">
          <Text fullWidth color="muted">
            {t("transfer.yourSelfRecipientHint")} 🫣
          </Text>
        </View>
      </Card>
    );
  }

  return !!resolvedAccount ? (
    <Card>
      <View className="gap-1 w-full">
        {simple ? (
          <View className="w-full flex flex-col">
            <Text fullWidth color="primary">
              {resolvedAccount.getReedSolomonAddress()}
            </Text>

            <Text fullWidth color="muted" size="small">
              {resolvedAccount.getNumericId()}
            </Text>
          </View>
        ) : (
          <>
            <Text fullWidth color="primary">
              {t("transfer.resolvedRecipientAddress", {
                address: resolvedAccount.getReedSolomonAddress(),
              })}
            </Text>
            <Text fullWidth color="muted" size="small">
              {t("transfer.resolvedRecipientAddressHint")} 😁
            </Text>
          </>
        )}
      </View>
    </Card>
  ) : null;
};
