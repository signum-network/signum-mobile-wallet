import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { Amount } from "@signumjs/util";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useTicker } from "@/hooks/useTicker";
import { useTokenMetadata } from "@/hooks/useTokenMetadata";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { formatNumber } from "@/utils/formatNumber";
import { useActiveMarketRate } from "@/hooks/useActiveMarketRate";
import { type TransactionCreation } from "../../utils/types";
import { ResolvedAccountCard } from "../../components/ResolvedAccountCard";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Props {
  onSubmit: () => void;
  isComplete: boolean;
  disableOnSubmit: boolean;
}

export const Confirmation = ({
  onSubmit,
  isComplete,
  disableOnSubmit,
}: Props) => {
  const { t } = useTranslation();
  const { iconColor } = useAppTheme();
  const { NativeTicker } = useTicker();
  const { price, symbol } = useActiveMarketRate();
  const { watch } = useFormContext<TransactionCreation>();

  const asset = watch("asset");
  const amount = watch("amount");
  const includeMemo = watch("includeMemo");
  const memo = watch("memo");
  const isMemoBinary = watch("isMemoBinary");
  const isMemoEncrypted = watch("isMemoEncrypted");
  const fee = watch("fee");

  const { ticker: tokenTicker } = useTokenMetadata(asset);

  const isAssetSigna = asset === "0";

  const readableTicker = isAssetSigna ? NativeTicker : tokenTicker;

  const signaAmountMarketValue =
    isAssetSigna && amount && price ? amount * price : 0;

  const signaFees = fee ? Number(Amount.fromPlanck(fee).getSigna()) : 0;

  const signaFeesMarketValue = signaFees && price ? signaFees * price : 0;

  return (
    <View className="gap-4 w-full">
      <Card>
        {isComplete && (
          <Card>
            <View className="w-full flex flex-col items-center gap-1">
              <Ionicons name="checkmark-circle" size={65} color="green" />

              <Text
                fullWidth
                className="text-center"
                color="success"
                size="large"
              >
                {t("transfer.signedTransactionTitle")}
              </Text>

              <Text fullWidth className="text-center" color="muted">
                {t("transfer.signedTransactionDescription")}
              </Text>
            </View>
          </Card>
        )}

        <View className="w-full flex flex-col gap-1">
          <Text size="large" color="muted" className="font-bold">
            {t("recipient")}
          </Text>

          <ResolvedAccountCard simple />
        </View>

        <View className="w-full flex flex-col gap-1">
          <Text size="large" color="muted" className="font-bold">
            {t("amount")}
          </Text>

          <View className="flex flex-row items-center justify-start gap-2 w-full">
            {/* TODO: Show asset avatar (SIGNA or Token) */}
            {/* <View className="w-10 h-10 bg-slate-300 rounded-lg"></View> */}

            <View className="flex-1 flex items-start flex-col gap-1">
              <Text className="font-medium">
                {`${formatNumber({ value: amount })} ${readableTicker}`}
              </Text>

              {!!signaAmountMarketValue && (
                <Text size="small" color="muted">{`${symbol}${formatNumber({
                  value: signaAmountMarketValue,
                  isFiat: true,
                })}`}</Text>
              )}
            </View>
          </View>
        </View>

        {!isComplete && (
          <View className="w-full flex flex-col gap-1">
            <Text size="large" color="muted" className="font-bold">
              {t("fees")}
            </Text>

            <View className="flex-1 flex items-start flex-col gap-1">
              <Text className="font-medium">
                {`${signaFees} ${NativeTicker}`}
              </Text>

              {!!signaFeesMarketValue && (
                <Text size="small" color="muted">
                  {`${symbol}${formatNumber({
                    value: signaFeesMarketValue,
                  })}`}
                </Text>
              )}
            </View>
          </View>
        )}

        {includeMemo && (
          <View className="w-full flex flex-col gap-1">
            <Text size="large" color="muted" className="font-bold">
              {t("textOrMemo")}
            </Text>

            {isMemoEncrypted && (
              <Text fullWidth color="success" size="small">
                🔐 {t("transfer.memoIsEncrypted")}
              </Text>
            )}

            {isMemoBinary ? (
              <Text fullWidth color="primary" size="small">
                🤖 {t("transfer.memoIsBinary")}
              </Text>
            ) : (
              <Text fullWidth color="muted" size="small">
                {memo}
              </Text>
            )}
          </View>
        )}
      </Card>

      {!isComplete && (
        <Card>
          <Text color="muted" className="text-center" fullWidth>
            {t("transfer.pressTheButtonLonger")}
          </Text>

          <Button
            icon={<Ionicons name="send" size={24} color={iconColor.blackout} />}
            type="blackout"
            size="large"
            title={t("transfer.confirmTransaction")}
            pressableProps={{
              delayLongPress: 2000,
              onLongPress: onSubmit,
              disabled: disableOnSubmit,
            }}
            fullWidth
          />
        </Card>
      )}
    </View>
  );
};
