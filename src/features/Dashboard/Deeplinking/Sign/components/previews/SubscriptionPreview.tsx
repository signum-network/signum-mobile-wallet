import { View } from "react-native";
import { useTranslation } from "react-i18next";
import type { Transaction } from "@signumjs/core";
import { Image } from "expo-image";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { useTicker } from "@/hooks/useTicker";
import { useActiveMarketRate } from "@/hooks/useActiveMarketRate";
import { formatNumber } from "@/utils/formatNumber";
import { signumBlueSymbolPicture } from "@/assets";
import type { ParsedTransaction } from "../../utils/parseTransaction";

interface Props {
  transaction: Transaction;
  parsed: ParsedTransaction;
}

// FIXME: THIS NEEDS TO BE REFACTORED

export const SubscriptionPreview = ({ transaction, parsed }: Props) => {
  const { t } = useTranslation();
  const { NativeTicker } = useTicker();
  const { price, symbol } = useActiveMarketRate();

  const feeSigna = Number(parsed.fee.getSigna());
  const feeMarketValue = price ? feeSigna * price : 0;

  const expense = parsed.expenses[0];
  const isCreation = parsed.type.i18nKey === "subscriptionCreation";

  const amount = expense.amount ? Number(expense.amount.getSigna()) : 0;
  const marketValue = price && amount ? amount * price : 0;

  // Frequency in seconds (from attachment for creation)
  const frequency = transaction.attachment?.frequency || 0;
  const frequencyDays = frequency ? Math.floor(frequency / 86400) : 0; // Convert seconds to days

  return (
    <>
      {/* Recipient (for creation) or Subscription ID (for cancellation) */}
      <View className="w-full flex flex-col gap-1">
        <Text size="large" color="muted" className="font-bold">
          {isCreation ? t("Recipient") : t("sign.subscription")}
        </Text>

        <Card>
          <Text className="font-medium">{expense.to}</Text>
        </Card>
      </View>

      {/* Subscription Details (for creation) */}
      {isCreation && (
        <>
          {/* Payment Amount */}
          <View className="w-full flex flex-col gap-1">
            <Text size="large" color="muted" className="font-bold">
              {t("sign.paymentAmount")}
            </Text>

            <View className="flex flex-row items-center justify-start gap-2 w-full">
              <View className="size-10">
                <Image
                  source={{ uri: signumBlueSymbolPicture }}
                  style={{ width: "100%", height: "100%", borderRadius: 8 }}
                />
              </View>

              <View className="flex-1 flex items-start flex-col gap-1">
                <Text className="font-medium">
                  {`${formatNumber({ value: amount })} ${NativeTicker}`}
                </Text>

                {!!marketValue && (
                  <Text size="small" color="muted">
                    {`${symbol}${formatNumber({
                      value: marketValue,
                      isFiat: true,
                    })}`}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Frequency */}
          <View className="w-full flex flex-col gap-1">
            <Text size="large" color="muted" className="font-bold">
              {t("sign.paymentFrequency")}
            </Text>

            <Card>
              <Text className="font-medium">
                {frequencyDays > 0
                  ? `${t("sign.every")} ${frequencyDays} ${t("sign.days")}`
                  : `${frequency} ${t("sign.seconds")}`}
              </Text>
            </Card>
          </View>

          {/* Explanation */}
          <Card>
            <Text size="small" color="muted">
              {t(
                "A recurring payment will be automatically sent to the recipient at the specified frequency."
              )}
            </Text>
          </Card>
        </>
      )}

      {/* Cancellation Notice */}
      {!isCreation && (
        <Card>
          <Text size="small" color="muted">
            {t("sign.subscriptionCancelExplanation")}
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
