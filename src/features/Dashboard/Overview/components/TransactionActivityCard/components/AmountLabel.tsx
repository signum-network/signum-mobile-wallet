import { Text } from "@/components/Text";
import { useTicker } from "@/hooks/useTicker";
import { formatNumber } from "@/utils/formatNumber";

interface Props {
  isNeutral?: boolean;
  isRecipient: boolean;
  tokenId?: string;
  value: string | number;
}

export const AmountLabel = ({
  isNeutral,
  isRecipient,
  tokenId,
  value,
}: Props) => {
  const { NativeTicker } = useTicker();

  const currentTicker = NativeTicker;

  if (isNeutral) {
    return (
      <Text className="font-bold text-end" size="small" color="muted">
        {value}
      </Text>
    );
  }

  return (
    <Text
      className="font-bold text-end"
      size="small"
      color={isRecipient ? "success" : "error"}
    >
      {`${isRecipient ? "+" : "-"} ${formatNumber({
        value,
      })} ${currentTicker}`}
    </Text>
  );
};
