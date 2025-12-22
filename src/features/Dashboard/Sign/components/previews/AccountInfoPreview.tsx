import { View } from "react-native";
import { useTranslation } from "react-i18next";
import type { Transaction } from "@signumjs/core";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { useTicker } from "@/hooks/useTicker";
import { useActiveMarketRate } from "@/hooks/useActiveMarketRate";
import { formatNumber } from "@/utils/formatNumber";
import type { ParsedTransaction } from "../../utils/parseTransaction";
import { tryGetJSON } from "../../utils/tryGetJson";
import {JsonView} from "@/components/JsonView";

interface Props {
  transaction: Transaction;
  parsed: ParsedTransaction;
}



export const AccountInfoPreview = ({ transaction, parsed }: Props) => {
  const { t } = useTranslation();
  const { NativeTicker } = useTicker();
  const { price, symbol } = useActiveMarketRate();

  const feeSigna = Number(parsed.fee.getSigna());
  const feeMarketValue = price ? feeSigna * price : 0;

  // Account info from attachment
  const accountName = transaction.attachment?.name || "";

  const accountDescription = transaction.attachment?.description || "";
  const json = tryGetJSON(accountDescription);

  return (
    <>
      {/* Account Name */}
      {accountName && (
        <View className="w-full flex flex-col gap-1">
          <Text size="large" color="muted" className="font-bold">
            {t("sign.accountName")}
          </Text>

          <Card>
            <Text className="font-medium">{accountName}</Text>
          </Card>
        </View>
      )}

      {/* Account Description */}
      {accountDescription && (
        <View className="w-full flex flex-col gap-1">
          <Text size="large" color="muted" className="font-bold">
            {t("sign.accountDescription")}
          </Text>

          <Card>
              (json
              ? <JsonView json={json}/>
              : <Text>{accountDescription}</Text>
              )
          </Card>
        </View>
      )}

      {/* Explanation */}
      <Card>
        <Text size="small" color="muted">
          {t(
            "This will update your account's public profile information visible to other users on the network."
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
              {`${symbol}${formatNumber({ value: feeMarketValue, isFiat: true })}`}
            </Text>
          )}
        </View>
      </View>
    </>
  );
};
