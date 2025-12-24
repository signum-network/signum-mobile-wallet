import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { TokenAvatar } from "@/components/Token/Avatar";
import { useTicker } from "@/hooks/useTicker";
import { useActiveMarketRate } from "@/hooks/useActiveMarketRate";
import { formatNumber } from "@/utils/formatNumber";
import type { ParsedTransaction } from "../../utils/parseTransaction";

interface Props {
  parsed: ParsedTransaction;
}

export const TokenIssuancePreview = ({ parsed }: Props) => {
  const { t } = useTranslation();
  const { NativeTicker } = useTicker();
  const { price, symbol } = useActiveMarketRate();
  const feeSigna = Number(parsed.fee.getSigna());
  const feeMarketValue = price ? feeSigna * price : 0;
  const expense = parsed.expenses[0];


  return (
    <>
      {/* Token Name */}
      <View className="w-full flex flex-col gap-1">
        <Text size="large" color="muted" className="font-bold">
          {t("sign.tokenName")}
        </Text>

        <View className="flex flex-row items-center justify-start gap-2 w-full">
          <TokenAvatar tokenId={expense.tokenId || ""}/>
          <View className="flex-1 flex items-start flex-col gap-1">
            <Text className="font-medium">{expense.tokenName || "Unnamed Token"}</Text>
          </View>
        </View>
      </View>

      {/* Token Details */}
      <View className="w-full flex flex-col gap-1">
        <Text size="large" color="muted" className="font-bold">
          {t("sign.tokenDetails")}
        </Text>

        <Card>
          <View className="mb-2">
            <Text size="small" color="muted">
              {t("sign.totalSupply")}
            </Text>
            <Text className="font-medium">{expense.quantity || "0"}</Text>
          </View>

          <View className="mb-2">
            <Text size="small" color="muted">
              {t("sign.decimals")}
            </Text>
            <Text className="font-medium">{expense.tokenDecimals || "0"}</Text>
          </View>

          <View>
            <Text size="small" color="muted">
              {t("sign.issuer")}
            </Text>
            <Text className="font-medium">{parsed.transaction.senderRS}</Text>
            <Text size="small" color="muted">
              {parsed.transaction.sender}
            </Text>
          </View>
        </Card>
      </View>

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
