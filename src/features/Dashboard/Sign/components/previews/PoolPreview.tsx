import { View } from "react-native";
import { useTranslation } from "react-i18next";
import type { Transaction } from "@signumjs/core";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { useTicker } from "@/hooks/useTicker";
import { useActiveMarketRate } from "@/hooks/useActiveMarketRate";
import { formatNumber } from "@/utils/formatNumber";
import type { ParsedTransaction } from "../../utils/parseTransaction";

interface Props {
  transaction: Transaction;
  parsed: ParsedTransaction;
}

export const PoolPreview = ({ parsed }: Props) => {
  const { t } = useTranslation();
  const { NativeTicker } = useTicker();
  const { price, symbol } = useActiveMarketRate();

  const feeSigna = Number(parsed.fee.getSigna());
  const feeMarketValue = price ? feeSigna * price : 0;

  const expense = parsed.expenses[0];

  return (
    <>
      {/* Pool Address */}
      <View className="w-full flex flex-col gap-1">
        <Text size="large" color="muted" className="font-bold">
          {t("sign.poolRewardRecipient")}
        </Text>

        <Card>
          <Text className="font-medium">{expense.to}</Text>
        </Card>
      </View>

      {/* Explanation */}
      <Card>
        <Text size="small" color="muted">
          {t(
            "This will assign your mining rewards to the specified pool or recipient. Your blocks will still show your account as the miner, but rewards will go to the recipient."
          )}
        </Text>
      </Card>

      {/* Fees */}
      <View className="w-full flex flex-col gap-1">
        <Text size="large" color="muted" className="font-bold">
          {t("fees")}
        </Text>

        <View className="flex-1 flex items-start flex-col gap-1">
          <Text className="font-medium">{`${feeSigna} ${NativeTicker}`}</Text>

          {!!feeMarketValue && (
            <Text size="small" color="muted">
              {`${symbol}${formatNumber({ value: feeMarketValue })}`}
            </Text>
          )}
        </View>
      </View>
    </>
  );
};
