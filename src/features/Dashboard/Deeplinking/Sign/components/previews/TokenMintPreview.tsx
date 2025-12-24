import { View } from "react-native";
import { useTranslation } from "react-i18next";
import type { Transaction } from "@signumjs/core";
import { ChainValue } from "@signumjs/util";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { useTicker } from "@/hooks/useTicker";
import { useActiveMarketRate } from "@/hooks/useActiveMarketRate";
import { useTokenMetadata } from "@/hooks/useTokenMetadata";
import { formatNumber } from "@/utils/formatNumber";
import type { ParsedTransaction } from "../../utils/parseTransaction";

interface Props {
  transaction: Transaction;
  parsed: ParsedTransaction;
}

export const TokenMintPreview = ({ transaction, parsed }: Props) => {
  const { t } = useTranslation();
  const { NativeTicker } = useTicker();
  const { price, symbol } = useActiveMarketRate();

  const feeSigna = Number(parsed.fee.getSigna());
  const feeMarketValue = price ? feeSigna * price : 0;

  const expense = parsed.expenses[0];
  const tokenMetadata = useTokenMetadata(expense.tokenId);

  // Format token quantity with decimals
  const quantity = expense.quantity || "0";
  const formattedQuantity = ChainValue.create(tokenMetadata.decimals)
    .setAtomic(quantity)
    .getCompound();

  return (
    <>
      {/* Token Being Minted */}
      <View className="w-full flex flex-col gap-1">
        <Text size="large" color="muted" className="font-bold">
          {t("token")}
        </Text>

        <Card>
          <Text className="font-medium">
            {tokenMetadata.ticker || expense.tokenId}
          </Text>
          {tokenMetadata.description && (
            <Text size="small" color="muted">
              {tokenMetadata.description}
            </Text>
          )}
        </Card>
      </View>

      {/* Mint Quantity */}
      <View className="w-full flex flex-col gap-1">
        <Text size="large" color="muted" className="font-bold">
          {t("sign.mintingQuantity")}
        </Text>

        <Card>
          <Text className="font-medium">
            {formatNumber({ value: Number(formattedQuantity) })}
          </Text>
        </Card>
      </View>

      {/* Recipient */}
      <View className="w-full flex flex-col gap-1">
        <Text size="large" color="muted" className="font-bold">
          {t("Recipient")}
        </Text>

        <Card>
          <Text className="font-medium">{transaction.senderRS}</Text>
          <Text size="small" color="muted">
            {transaction.sender}
          </Text>
        </Card>
      </View>

      {/* Explanation */}
      <Card>
        <Text size="small" color="muted">
          {t("sign.mintingExplanation")}
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
