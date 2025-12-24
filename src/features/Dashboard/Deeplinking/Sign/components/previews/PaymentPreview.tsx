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

export const PaymentPreview = ({ transaction, parsed }: Props) => {
  const { t } = useTranslation();
  const { NativeTicker } = useTicker();
  const { price, symbol } = useActiveMarketRate();

  const feeSigna = Number(parsed.fee.getSigna());
  const feeMarketValue = price ? feeSigna * price : 0;

  return (
    <>
      {/* Expenses (Recipients) */}
      {parsed.expenses.map((expense, index) => {
        const amount = expense.amount ? Number(expense.amount.getSigna()) : 0;
        const marketValue = price && amount ? amount * price : 0;

        return (
          <View key={index} className="w-full flex flex-col gap-1">
            <Text size="large" color="muted" className="font-bold">
              {t("recipient")} {parsed.expenses.length > 1 && `#${index + 1}`}
            </Text>

            <Card>
              <Text className="font-medium">{expense.to}</Text>
            </Card>

            {expense.amount && (
              <View className="flex flex-row items-center justify-start gap-2 w-full mt-2">
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
                    <Text size="small" color="muted">{`${symbol}${formatNumber({
                      value: marketValue,
                      isFiat: true,
                    })}`}</Text>
                  )}
                </View>
              </View>
            )}
          </View>
        );
      })}

      {/* Fees */}
      <View className="w-full flex flex-col gap-1">
        <Text size="large" color="muted" className="font-bold">
          {t("fees")}
        </Text>

        <View className="flex-1 flex items-start flex-col gap-1">
          <Text className="font-medium">{`${feeSigna} ${NativeTicker}`}</Text>

          {!!feeMarketValue && (
            <Text size="small" color="muted">
              {`${symbol}${formatNumber({
                value: feeMarketValue,
              })}`}
            </Text>
          )}
        </View>
      </View>

      {/* Message/Memo */}
      {transaction.attachment?.message && (
        <View className="w-full flex flex-col gap-1">
          <Text size="large" color="muted" className="font-bold">
            {t("textOrMemo")}
          </Text>

          {transaction.attachment["version.EncryptedMessage"] ? (
            <Text fullWidth color="success" size="small">
              🔐 {t("transfer.memoIsEncrypted")}
            </Text>
          ) : (
            <Text fullWidth color="muted" size="small">
              {transaction.attachment.messageIsText
                ? transaction.attachment.message
                : "🤖 " + t("transfer.memoIsBinary")}
            </Text>
          )}
        </View>
      )}
    </>
  );
};
