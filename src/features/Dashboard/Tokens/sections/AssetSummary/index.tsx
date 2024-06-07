import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { formatNumber } from "@/utils/formatNumber";
import { useTicker } from "@/hooks/useTicker";
import { useActiveMarketRate } from "@/hooks/useActiveMarketRate";

export const AssetSummary = () => {
  const { t } = useTranslation();
  const { NativeTicker } = useTicker();
  const { price, symbol } = useActiveMarketRate();

  // return null;

  return (
    <Card>
      <View className="flex flex-col gap-1">
        <Text size="large" className="font-medium">
          {t("overview.tokens.totalValue")}
        </Text>

        <View>
          <View className="w-full flex flex-row items-center gap-1">
            <Text className="font-medium" size="large">
              {formatNumber({ value: 7500000 })}
            </Text>

            <Text color="muted" className="font-medium">
              {NativeTicker}
            </Text>
          </View>

          <Text size="large" color="muted" className="font-medium">
            {`${symbol}${formatNumber({
              value: 15000,
              isFiat: true,
            })}`}
          </Text>
        </View>
      </View>
    </Card>
  );
};
