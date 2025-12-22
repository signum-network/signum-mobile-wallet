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

export const ContractCreationPreview = ({ parsed }: Props) => {
  const { t } = useTranslation();
  const { NativeTicker } = useTicker();
  const { price, symbol } = useActiveMarketRate();

  const feeSigna = Number(parsed.fee.getSigna());
  const feeMarketValue = price ? feeSigna * price : 0;

  const expense = parsed.expenses[0];
  const initialBalance = expense.amount ? Number(expense.amount.getSigna()) : 0;
  const marketValue = price && initialBalance ? initialBalance * price : 0;

  return (
    <>
      {/* Contract Reference */}
      {expense.hash && (
        <View className="w-full flex flex-col gap-1">
          <Text size="large" color="muted" className="font-bold">
            {t("sign.contractReference")}
          </Text>

          <Card>
            <Text className="font-medium font-mono" size="small">
              {expense.hash}
            </Text>
          </Card>
        </View>
      )}

      {/* Initial Balance */}
      {initialBalance > 0 && (
        <View className="w-full flex flex-col gap-1">
          <Text size="large" color="muted" className="font-bold">
            {t("sign.initialBalance")}
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
                {`${formatNumber({ value: initialBalance })} ${NativeTicker}`}
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
      )}

      {/* Explanation */}
      <Card>
        <Text size="small" color="muted">
          {t(
            "Creating a smart contract that will be deployed to the blockchain. The initial balance will be transferred to the contract."
          )}
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
