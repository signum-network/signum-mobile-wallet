import { View } from "react-native";
import { useTranslation } from "react-i18next";
import type { Transaction } from "@signumjs/core";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { useTicker } from "@/hooks/useTicker";
import { formatNumber } from "@/utils/formatNumber";
import type { ParsedTransaction } from "../../utils/parseTransaction";

interface Props {
  transaction: Transaction;
  parsed: ParsedTransaction;
}

export const GenericPreview = ({ transaction, parsed }: Props) => {
  const { t } = useTranslation();
  const { NativeTicker } = useTicker();

  const feeSigna = Number(parsed.fee.getSigna());

  return (
    <>
      {/* Expenses */}
      {parsed.expenses.length > 0 && (
        <View className="w-full flex flex-col gap-2">
          <Text size="large" color="muted" className="font-bold">
            {t("sign.transactionDetails")}
          </Text>

          {parsed.expenses.map((expense, index) => (
            <Card key={index}>
              {expense.to && (
                <View className="mb-2">
                  <Text size="small" color="muted">
                    {parsed.expenses.length > 1 ? `Recipient #${index + 1}` : "Recipient"}
                  </Text>
                  <Text className="font-medium">{expense.to}</Text>
                </View>
              )}

              {expense.amount && (
                <View className="mb-2">
                  <Text size="small" color="muted">Amount</Text>
                  <Text className="font-medium">
                    {formatNumber({ value: Number(expense.amount.getSigna()) })}{" "}
                    {NativeTicker}
                  </Text>
                </View>
              )}

              {expense.tokenId && (
                <View className="mb-2">
                  <Text size="small" color="muted">Token ID</Text>
                  <Text className="font-medium">{expense.tokenId}</Text>
                </View>
              )}

              {expense.quantity && (
                <View className="mb-2">
                  <Text size="small" color="muted">Quantity</Text>
                  <Text className="font-medium">{expense.quantity}</Text>
                </View>
              )}

              {expense.tokenName && (
                <View className="mb-2">
                  <Text size="small" color="muted">Token Name</Text>
                  <Text className="font-medium">{expense.tokenName}</Text>
                </View>
              )}

              {expense.aliasName && (
                <View className="mb-2">
                  <Text size="small" color="muted">Alias</Text>
                  <Text className="font-medium">{expense.aliasName}</Text>
                </View>
              )}

              {expense.price && (
                <View className="mb-2">
                  <Text size="small" color="muted">Price (NQT)</Text>
                  <Text className="font-medium">{expense.price}</Text>
                </View>
              )}
            </Card>
          ))}
        </View>
      )}

      {/* Sender */}
      <View className="w-full flex flex-col gap-1">
        <Text size="large" color="muted" className="font-bold">
          {t("sign.sender")}
        </Text>

        <Card>
          <Text className="font-medium">{transaction.senderRS}</Text>
          <Text size="small" color="muted">
            {transaction.sender}
          </Text>
        </Card>
      </View>

      {/* Fees */}
      <View className="w-full flex flex-col gap-1">
        <Text size="large" color="muted" className="font-bold">
          {t("fees")}
        </Text>

        <Text className="font-medium">{`${feeSigna} ${NativeTicker}`}</Text>
      </View>

      {/* Attachment Info */}
      {transaction.attachment && Object.keys(transaction.attachment).length > 0 && (
        <View className="w-full flex flex-col gap-1">
          <Text size="large" color="muted" className="font-bold">
            {t("sign.attachmentData")}
          </Text>

          <Card>
            <Text size="small" className="font-mono">
              {JSON.stringify(transaction.attachment, null, 2)}
            </Text>
          </Card>
        </View>
      )}

      <Card>
        <Text size="small" color="muted" className="text-center">
          ℹ️ {t("sign.genericTransactionHint")}
        </Text>
        <Text size="small" color="muted" className="text-center mt-1">
          {t("sign.switchToJsonHint")}
        </Text>
      </Card>
    </>
  );
};
