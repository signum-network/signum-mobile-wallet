import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { useWalletAccount } from "@/hooks/useWalletAccount";
import { useTicker } from "@/hooks/useTicker";
import { useActiveMarketRate } from "@/hooks/useActiveMarketRate";
import { formatNumber } from "@/utils/formatNumber";

export const Balance = () => {
  const { t } = useTranslation();
  const { NativeTicker } = useTicker();
  const { price, symbol } = useActiveMarketRate();
  const {
    accountData: { balance },
  } = useWalletAccount();

  const totalBalance = useMemo(() => {
    return balance?.totalBalance?.getSigna
      ? Number(balance?.totalBalance?.getSigna())
      : 0;
  }, [balance]);

  const availableBalance = useMemo(() => {
    return balance?.availableBalance?.getSigna
      ? balance?.availableBalance?.getSigna()
      : "0";
  }, [balance]);

  const committedBalance = useMemo(() => {
    return balance?.committedBalance?.getSigna
      ? balance?.committedBalance?.getSigna()
      : "0";
  }, [balance]);

  const totalBalanceMarketValue =
    totalBalance && price ? totalBalance * price : 0;

  return (
    <Card>
      <View className="w-full flex flex-row justify-between items-center">
        <View className="flex flex-col gap-1">
          <View className="w-full flex flex-row items-center gap-1">
            <Text size="large" className="font-medium">
              {t("balance")}
            </Text>
          </View>

          <View className="w-full flex flex-row items-center gap-2">
            <Text className="font-medium text-xl">
              {formatNumber({ value: totalBalance })} {NativeTicker}
            </Text>

            <Text size="large" color="muted" className="font-medium text-xl">
              {`(${symbol}${formatNumber({
                value: totalBalanceMarketValue,
                isFiat: true,
              })})`}
            </Text>
          </View>

          <Text color="muted">
            {`${t("availableBalance")}: ${formatNumber({
              value: availableBalance,
            })}`}
          </Text>

          <Text color="muted">
            {`${t("committedBalance")}: ${formatNumber({
              value: committedBalance,
            })}`}
          </Text>
        </View>
      </View>
    </Card>
  );
};
