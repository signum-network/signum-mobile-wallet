import { View } from "react-native";
import { useTranslation } from "react-i18next";
import type { Transaction } from "@signumjs/core";
import { ChainValue } from "@signumjs/util";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { TokenAvatar } from "@/components/Token/Avatar";
import { useTicker } from "@/hooks/useTicker";
import { useActiveMarketRate } from "@/hooks/useActiveMarketRate";
import { useTokenMetadata } from "@/hooks/useTokenMetadata";
import { formatNumber } from "@/utils/formatNumber";
import type { ParsedTransaction } from "../../utils/parseTransaction";

interface Props {
  transaction: Transaction;
  parsed: ParsedTransaction;
}

export const TokenTransferPreview = ({ parsed }: Props) => {
  const { t } = useTranslation();
  const { NativeTicker } = useTicker();
  const { price, symbol } = useActiveMarketRate();

  const feeSigna = Number(parsed.fee.getSigna());
  const feeMarketValue = price ? feeSigna * price : 0;

  return (
    <>
      {/* Tokens Being Transferred */}
      {parsed.expenses.map((expense, index) => {
        const tokenMetadata = useTokenMetadata(expense.tokenId);
        const quantity = expense.quantity || "0";

        // Format token amount with decimals
        const formattedAmount = ChainValue.create(tokenMetadata.decimals)
          .setAtomic(quantity)
          .getCompound();

        return (
          <View key={index} className="w-full flex flex-col gap-1">
            <Text size="large" color="muted" className="font-bold">
              {t("recipient")} {parsed.expenses.length > 1 && `#${index + 1}`}
            </Text>

            <Card>
              <Text className="font-medium">{expense.to}</Text>
            </Card>

            {/* Token Amount */}
            <View className="w-full flex flex-col gap-1 mt-2">
              <Text size="large" color="muted" className="font-bold">
                {t("amount")}
              </Text>

              <View className="flex flex-row items-center justify-start gap-2 w-full">
                <TokenAvatar tokenId={expense.tokenId || ""}/>

                <View className="flex-1 flex items-start flex-col gap-1">
                  <Text className="font-medium">
                    {`${formatNumber({ value: Number(formattedAmount) })} ${tokenMetadata.ticker || expense.tokenId}`}
                  </Text>

                  {tokenMetadata.description && (
                    <Text size="small" color="muted">
                      {tokenMetadata.description}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        );
      })}

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
