import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { Text } from "@/components/Text";
import { formatNumber } from "@/utils/formatNumber";

interface Props {
  readableTicker: string;
  readableAvailableBalance: number;
}

export const AvailableBalanceSummary = ({
  readableTicker,
  readableAvailableBalance,
}: Props) => {
  const { t } = useTranslation();

  return (
    <View className="flex flex-row gap-2 items-center justify-start flex-1">
      {/* TODO: Show asset avatar (SIGNA or Token) */}
      {/* <View className="w-10 h-10 bg-slate-300 rounded-lg"></View> */}

      <View className="flex flex-col">
        <Text className="font-medium">
          {t("transfer.assetAvailableBalanceHint", { ticker: readableTicker })}
        </Text>

        <Text size="large" color="muted">
          {formatNumber({
            value: readableAvailableBalance,
          })}
        </Text>
      </View>
    </View>
  );
};
