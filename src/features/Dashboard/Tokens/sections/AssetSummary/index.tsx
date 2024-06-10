import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { formatNumber } from "@/utils/formatNumber";
import { useTicker } from "@/hooks/useTicker";
import { useActiveMarketRate } from "@/hooks/useActiveMarketRate";

interface Props {
  estimatedValue: number;
}

export const AssetSummary = ({ estimatedValue }: Props) => {
  const { t } = useTranslation();
  const { NativeTicker } = useTicker();
  const { price, symbol } = useActiveMarketRate();

  const estimatedMarketValue =
    estimatedValue && price ? estimatedValue * price : 0;

  return (
    <Card>
      <View className="flex flex-col gap-1">
        <Text size="large" className="font-medium">
          {t("overview.tokens.totalValue")}
        </Text>

        <View>
          <View className="w-full flex flex-row items-center gap-1">
            <Text className="font-medium" size="large">
              {formatNumber({ value: estimatedValue })}
            </Text>

            <Text color="muted" className="font-medium">
              {NativeTicker}
            </Text>
          </View>

          <Text size="large" color="muted" className="font-medium">
            {`${symbol}${formatNumber({
              value: estimatedMarketValue,
              isFiat: true,
            })}`}
          </Text>
        </View>
      </View>
    </Card>
  );
};
