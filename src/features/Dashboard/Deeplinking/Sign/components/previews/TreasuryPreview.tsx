import { View } from "react-native";
import { useTranslation } from "react-i18next";
import type { Transaction } from "@signumjs/core";
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

export const TreasuryPreview = ({ transaction, parsed }: Props) => {
  const { t } = useTranslation();
  const { NativeTicker } = useTicker();
  const { price, symbol } = useActiveMarketRate();

  const feeSigna = Number(parsed.fee.getSigna());
  const feeMarketValue = price ? feeSigna * price : 0;

  // Token ID from attachment
  const tokenId = transaction.attachment?.asset || "";
  const tokenMetadata = useTokenMetadata(tokenId);

  // Treasury account being added
  const treasuryAccount = transaction.recipient || "";

  return (
    <>
      {/* Token */}
      <View className="w-full flex flex-col gap-1">
        <Text size="large" color="muted" className="font-bold">
          {t("token")}
        </Text>

        <Card>
          <Text className="font-medium">
            {tokenMetadata.ticker || tokenId}
          </Text>
          {tokenMetadata.description && (
            <Text size="small" color="muted">
              {tokenMetadata.description}
            </Text>
          )}
        </Card>
      </View>

      {/* Treasury Account */}
      <View className="w-full flex flex-col gap-1">
        <Text size="large" color="muted" className="font-bold">
          {t("sign.treasuryAccount")}
        </Text>

        <Card>
          <Text className="font-medium">{treasuryAccount}</Text>
        </Card>
      </View>

      {/* Explanation */}
      <Card>
        <Text size="small" color="muted">
          {t('sign.addTreasuryAccountExplanation')}
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
