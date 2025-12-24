import { View } from "react-native";
import { useTranslation } from "react-i18next";
import type { Transaction } from "@signumjs/core";
import { ChainValue } from "@signumjs/util";
import { Image } from "expo-image";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { useTicker } from "@/hooks/useTicker";
import { useActiveMarketRate } from "@/hooks/useActiveMarketRate";
import { useTokenMetadata } from "@/hooks/useTokenMetadata";
import { formatNumber } from "@/utils/formatNumber";
import { signumBlueSymbolPicture } from "@/assets";
import type { ParsedTransaction } from "../../utils/parseTransaction";

interface Props {
  transaction: Transaction;
  parsed: ParsedTransaction;
}

export const DistributionPreview = ({ parsed }: Props) => {
  const { t } = useTranslation();
  const { NativeTicker } = useTicker();
  const { price, symbol } = useActiveMarketRate();

  const feeSigna = Number(parsed.fee.getSigna());
  const feeMarketValue = price ? feeSigna * price : 0;

  // First expense is the base token (whose holders receive distribution)
  const baseTokenExpense = parsed.expenses[0];
  const baseTokenMetadata = useTokenMetadata(baseTokenExpense.tokenId);

  // Second expense (if exists) is the distribution asset
  const distributionExpense = parsed.expenses[1];
  const distributionTokenId = distributionExpense?.tokenId || "0";
  const distributionTokenMetadata = useTokenMetadata(distributionTokenId);

  // Distribution amount (from first expense if SIGNA, or second expense if token)
  const distributionAmount = baseTokenExpense.amount
    ? Number(baseTokenExpense.amount.getSigna())
    : 0;
  const distributionMarketValue =
    price && distributionAmount ? distributionAmount * price : 0;

  // Format distribution token quantity if it's a token distribution
  const distributionQuantity = distributionExpense?.quantity || "0";
  const formattedDistributionQuantity = ChainValue.create(
    distributionTokenMetadata.decimals
  )
    .setAtomic(distributionQuantity)
    .getCompound();

  // Minimum quantity threshold
  const minimumQuantity = baseTokenExpense.quantity || "0";
  const formattedMinimumQuantity = ChainValue.create(baseTokenMetadata.decimals)
    .setAtomic(minimumQuantity)
    .getCompound();

  const isSignaDistribution = distributionTokenId === "0";

  return (
    <>
      {/* Base Token (Holders Receiving Distribution) */}
      <View className="w-full flex flex-col gap-1">
        <Text size="large" color="muted" className="font-bold">
          {t("sign.distributingToHoldersOf")}
        </Text>

        <Card>
          <Text className="font-medium">
            {baseTokenMetadata.ticker || baseTokenExpense.tokenId}
          </Text>
          {baseTokenMetadata.description && (
            <Text size="small" color="muted">
              {baseTokenMetadata.description}
            </Text>
          )}
          <Text size="small" color="muted" className="mt-1">
            {t("sign.minimumHolding")}: {formatNumber({ value: Number(formattedMinimumQuantity) })}
          </Text>
        </Card>
      </View>

      {/* Distribution Amount/Asset */}
      <View className="w-full flex flex-col gap-1">
        <Text size="large" color="muted" className="font-bold">
          {t("sign.distributing")}
        </Text>

        {isSignaDistribution ? (
          <View className="flex flex-row items-center justify-start gap-2 w-full">
            <View className="size-10">
              <Image
                source={{ uri: signumBlueSymbolPicture }}
                style={{ width: "100%", height: "100%", borderRadius: 8 }}
              />
            </View>

            <View className="flex-1 flex items-start flex-col gap-1">
              <Text className="font-medium">
                {`${formatNumber({ value: distributionAmount })} ${NativeTicker}`}
              </Text>

              {!!distributionMarketValue && (
                <Text size="small" color="muted">
                  {`${symbol}${formatNumber({
                    value: distributionMarketValue,
                    isFiat: true,
                  })}`}
                </Text>
              )}
            </View>
          </View>
        ) : (
          <Card>
            <Text className="font-medium">
              {formatNumber({ value: Number(formattedDistributionQuantity) })}{" "}
              {distributionTokenMetadata.ticker || distributionTokenId}
            </Text>
            {distributionTokenMetadata.description && (
              <Text size="small" color="muted">
                {distributionTokenMetadata.description}
              </Text>
            )}
          </Card>
        )}
      </View>

      {/* Explanation */}
      <Card>
        <Text size="small" color="muted">
          {t(
            "This will distribute assets proportionally to all token holders who meet the minimum threshold."
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
