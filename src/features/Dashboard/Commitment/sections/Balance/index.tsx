import { useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { useFormContext } from "react-hook-form";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { useAccount } from "@/hooks/useAccount";
import { useTicker } from "@/hooks/useTicker";
import { formatNumber } from "@/utils/formatNumber";
import { type ManageCommitment } from "../../utils/types";

export const Balance = () => {
  const { t } = useTranslation();
  const { NativeTicker } = useTicker();
  const {
    accountData: { balance },
  } = useAccount();
  const { setValue } = useFormContext<ManageCommitment>();

  const availableBalance = useMemo(() => {
    return balance?.availableBalance?.getSigna
      ? Number(balance?.availableBalance?.getSigna())
      : 0;
  }, [balance]);

  const committedBalance = useMemo(() => {
    return balance?.committedBalance?.getSigna
      ? Number(balance?.committedBalance?.getSigna())
      : 0;
  }, [balance]);

  const percentageCommitted = useMemo(() => {
    const totalBalance = balance?.totalBalance?.getSigna
      ? Number(balance?.totalBalance?.getSigna())
      : 0;

    return (committedBalance / totalBalance) * 100 || 0;
  }, [committedBalance]);

  useEffect(() => {
    setValue("maxAmount", availableBalance);
  }, [availableBalance]);

  return (
    <Card>
      <View className="w-full flex flex-row justify-between items-center">
        <View className="flex flex-col gap-2">
          <View className="w-full flex flex-row items-center gap-1">
            <Text size="large" className="font-medium">
              {t("balance")}
            </Text>

            <Text color="muted" className="font-medium">
              {NativeTicker}
            </Text>
          </View>

          <View className="w-full flex flex-row items-center justify-between">
            <Text color="muted">{t("availableBalance")}</Text>

            <Text className="font-bold">
              {formatNumber({
                value: availableBalance,
              })}
            </Text>
          </View>

          <View className="w-full flex flex-row items-center justify-between">
            <Text color="muted">{t("committedBalance")}</Text>

            <Text className="font-bold">
              {formatNumber({
                value: committedBalance,
              })}
            </Text>
          </View>

          {!!percentageCommitted && (
            <Text color="muted" className="text-center">
              {t("commitment.amountIsCommited", {
                percentage: percentageCommitted.toFixed(2),
              })}
            </Text>
          )}
        </View>
      </View>
    </Card>
  );
};
