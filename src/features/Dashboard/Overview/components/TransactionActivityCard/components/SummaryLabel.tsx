import { Fragment, useMemo } from "react";
import { Transaction } from "@signumjs/core";
import { Amount, ChainValue } from "@signumjs/util";
import { useTicker } from "@/hooks/useTicker";
import { useAccount } from "@/hooks/useAccount";
import { useToken } from "@/hooks/useToken";
import { Text } from "@/components/Text";
import {
  formatNumber,
  defaultMaximumFractionDigits,
} from "@/utils/formatNumber";
import { type AvailableTransactionString } from "../../../sections/Activity/utils/transactionTypeReader";

interface Props extends Transaction {
  transactionReadableType?: AvailableTransactionString;
  isNeutral?: boolean;
  isSender?: boolean;
}

export const SummaryLabel = ({
  transactionReadableType,
  isNeutral,
  isSender,
  amountNQT,
  attachment,
}: Props) => {
  const { accountId } = useAccount();

  // Note: Isolating summary logic here because attachment is not typed
  // We have similar behavior as we do on the <TransactionActivityCard/> component
  // I isolated this here because the attachment of a transaction has the "any" type
  // So i had to read each transaction attachment onchain in order to have a smaller component and show it properly on the UI :D

  const Summary = useMemo(() => {
    switch (transactionReadableType) {
      case "Ordinary": {
        return <AmountText isSender={isSender} value={amountNQT} />;
      }

      case "MultiOut": {
        let value = amountNQT;

        if (!isSender) {
          const multiOutSpecificRecipient = attachment.recipients.find(
            (data: any) => data[0] === accountId
          );

          value = multiOutSpecificRecipient[1];
        }

        return <AmountText isSender={isSender} value={value} />;
      }

      case "MultiOutSameAmount": {
        let value = amountNQT;

        if (!isSender) {
          const amountOfRecipients = attachment.recipients.length;
          const amountReceived = Amount.fromPlanck(value)
            .divide(amountOfRecipients)
            .getPlanck();
          value = amountReceived;
        }

        return <AmountText isSender={isSender} value={value} />;
      }

      case "AssetTransfer": {
        return (
          <Fragment>
            {!!amountNQT && (
              <AmountText isSender={isSender} value={amountNQT} />
            )}

            {!!(attachment.asset && attachment.quantityQNT) && (
              <AmountText
                isSender={isSender}
                tokenId={attachment.asset}
                value={attachment.quantityQNT}
              />
            )}
          </Fragment>
        );
      }

      default:
        return null;
    }
  }, [transactionReadableType, accountId, amountNQT, isNeutral, attachment]);

  return <Fragment>{Summary}</Fragment>;
};

interface TextProps {
  value: string;
  tokenId?: string;
  isSender?: boolean;
}

const NeutralText = ({ tokenId, value }: TextProps) => {
  return (
    <Text className="font-bold text-end" size="small" color="muted">
      {value}
    </Text>
  );
};

const AmountText = ({ isSender, tokenId, value }: TextProps) => {
  const { NativeTicker } = useTicker();
  const { ticker: tokenTicker, decimals } = useToken(tokenId);

  const readableValue = tokenId
    ? ChainValue.create(decimals).setAtomic(value).getCompound()
    : Amount.fromPlanck(value).getSigna();
  const readableDecimals = tokenId ? decimals : defaultMaximumFractionDigits;
  const readableTicker = tokenId ? tokenTicker : NativeTicker;

  return (
    <Text
      className="font-bold text-end"
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
