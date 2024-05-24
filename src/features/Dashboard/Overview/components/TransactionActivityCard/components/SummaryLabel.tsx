import { useMemo } from "react";
import { Transaction } from "@signumjs/core";
import { useTicker } from "@/hooks/useTicker";
import { Text } from "@/components/Text";
import { formatNumber } from "@/utils/formatNumber";
import { type AvailableTransactionString } from "../../../sections/Activity/utils/transactionTypeReader";

interface Props extends Transaction {
  transactionReadableType?: AvailableTransactionString;
  isNeutral?: boolean;
  isRecipient?: boolean;
}

export const SummaryLabel = ({
  transactionReadableType,
  isNeutral,
  isRecipient,
}: Props) => {
  return <AmountText value="klk" isRecipient={isRecipient} />;
};

interface TextProps {
  value: string;
  tokenId?: boolean;
  isRecipient?: boolean;
}

const NeutralText = ({ tokenId, value }: TextProps) => {
  const { NativeTicker } = useTicker();

  return (
    <Text className="font-bold text-end" size="small" color="muted">
      {value}
    </Text>
  );
};

const AmountText = ({ tokenId, value, isRecipient = false }: TextProps) => {
  const { NativeTicker } = useTicker();

  return (
    <Text
      className="font-bold text-end"
      size="small"
      color={isRecipient ? "success" : "error"}
    >
      {isRecipient ? "+" : "-"} {value}
    </Text>
  );
};
