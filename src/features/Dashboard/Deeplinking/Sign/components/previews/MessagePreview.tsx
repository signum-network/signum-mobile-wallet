import { View } from "react-native";
import { useTranslation } from "react-i18next";
import type { Transaction } from "@signumjs/core";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { useTicker } from "@/hooks/useTicker";
import { useActiveMarketRate } from "@/hooks/useActiveMarketRate";
import { formatNumber } from "@/utils/formatNumber";
import type { ParsedTransaction } from "../../utils/parseTransaction";

interface Props {
  transaction: Transaction;
  parsed: ParsedTransaction;
}

export const MessagePreview = ({ transaction, parsed }: Props) => {
  const { t } = useTranslation();
  const { NativeTicker } = useTicker();
  const { price, symbol } = useActiveMarketRate();

  const feeSigna = Number(parsed.fee.getSigna());
  const feeMarketValue = price ? feeSigna * price : 0;

  const expense = parsed.expenses[0];
  const isEncrypted = transaction.attachment?.["version.EncryptedMessage"];
  const isText = transaction.attachment?.messageIsText;
  const message = transaction.attachment?.message;

  return (
    <>
      {/* Recipient */}
      <View className="w-full flex flex-col gap-1">
        <Text size="large" color="muted" className="font-bold">
          {t("recipient")}
        </Text>

        <Card>
          <Text className="font-medium">{expense?.to || transaction.recipient}</Text>
        </Card>
      </View>

      {/* Message Content */}
      {message && (
        <View className="w-full flex flex-col gap-1">
          <Text size="large" color="muted" className="font-bold">
            {t("textOrMemo")}
          </Text>

          {isEncrypted ? (
            <Text fullWidth color="success" size="small">
              🔐 {t("transfer.memoIsEncrypted")}
            </Text>
          ) : (
            <Card>
              <Text fullWidth color="muted" size="small">
                {isText ? message : "🤖 " + t("transfer.memoIsBinary")}
              </Text>
            </Card>
          )}
        </View>
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
