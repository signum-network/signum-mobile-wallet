import { useTranslation } from "react-i18next";
import { Amount, ChainValue } from "@signumjs/util";
import { Text } from "@/components/Text";
import { useToken } from "@/hooks/useToken";
import { useTicker } from "@/hooks/useTicker";
import {
  formatNumber,
  defaultMaximumFractionDigits,
} from "@/utils/formatNumber";
import type { TextProps } from "./types";
import { NeutralText } from "./NeutralText";

export const AmountText = ({ isSender, tokenId, value }: TextProps) => {
  const { t } = useTranslation();
  const { NativeTicker } = useTicker();
  const { ticker: tokenTicker, decimals } = useToken(tokenId);

  const readableValue = tokenId
    ? ChainValue.create(decimals).setAtomic(value).getCompound()
    : Amount.fromPlanck(value).getSigna();
  const readableDecimals = tokenId ? decimals : defaultMaximumFractionDigits;
  const readableTicker = tokenId ? tokenTicker : NativeTicker;

  if (tokenId && !tokenTicker) return <NeutralText value={`${t("loading")}`} />;

  return (
    <Text
      className="font-medium text-end"
      size="small"
      color={isSender ? "error" : "success"}
    >
      {`${isSender ? "-" : "+"} ${formatNumber({
        value: readableValue,
        maximumFractionDigits: readableDecimals,
      })} ${readableTicker}`}
    </Text>
  );
};
