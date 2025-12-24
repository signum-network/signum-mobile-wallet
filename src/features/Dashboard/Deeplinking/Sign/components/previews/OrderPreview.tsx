import { View } from "react-native";
import { useTranslation } from "react-i18next";
import type { Transaction } from "@signumjs/core";
import {Amount, ChainValue, convertAssetPriceToPlanck} from "@signumjs/util";
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

export const OrderPreview = ({ parsed }: Props) => {
  const { t } = useTranslation();
  const { NativeTicker } = useTicker();
  const { price: marketPrice, symbol } = useActiveMarketRate();

  const feeSigna = Number(parsed.fee.getSigna());
  const feeMarketValue = marketPrice ? feeSigna * marketPrice : 0;

  const expense = parsed.expenses[0];
  const tokenMetadata = useTokenMetadata(expense.tokenId);

  const orderType = parsed.type.i18nKey;
  const isCancel =
    orderType === "cancelSaleOrder" || orderType === "cancelBuyOrder";
  const isBuy = orderType === "createBuyOrder";

  // Format token quantity with decimals
  const quantity = expense.quantity || "0";
  const formattedQuantity = ChainValue.create(tokenMetadata.decimals)
    .setAtomic(quantity)
    .getCompound();

  // Price is in NQT per token quantum
  const priceNQT = convertAssetPriceToPlanck(expense.price || "0", tokenMetadata.decimals);
  const pricePerToken = Amount.fromPlanck(priceNQT); // Convert NQT to SIGNA

  // Total order value
  const totalValue = pricePerToken.multiply(Number(formattedQuantity))

  return (
    <>
      {/* Token */}
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

      {/* Order Details (for create orders) */}
      {!isCancel && (
        <>
          <View className="w-full flex flex-col gap-1">
            <Text size="large" color="muted" className="font-bold">
              {t("sign.orderDetails")}
            </Text>

            <Card>
              <View className="mb-2">
                <Text size="small" color="muted">
                  {t("sign.quantity")}
                </Text>
                <Text className="font-medium">
                  {formatNumber({ value: Number(formattedQuantity) })}
                </Text>
              </View>

              <View className="mb-2">
                <Text size="small" color="muted">
                  {t("sign.pricePerToken")}
                </Text>
                <Text className="font-medium">
                  {`${formatNumber({ value: pricePerToken.getSigna() })} ${NativeTicker}`}
                </Text>
              </View>

              <View>
                <Text size="small" color="muted">
                  {t("sign.totalValue")}
                </Text>
                <Text className="font-medium">
                  {`${formatNumber({ value: totalValue.getSigna() })} ${NativeTicker}`}
                </Text>
              </View>
            </Card>
          </View>
        </>
      )}

      {/* Cancellation Notice */}
      {isCancel && (
        <Card>
          <Text size="small" color="muted">
            {isBuy
              ? t("sign.buyOrderCancelExplanation")
              : t("sign.sellOrderCancelExplanation")}
          </Text>
        </Card>
      )}

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
