import { Fragment, useMemo } from "react";
import { Transaction } from "@signumjs/core";
import { Amount } from "@signumjs/util";
import { useAccount } from "@/hooks/useAccount";
import type { AvailableTransactionString } from "../../../../utils/transactionTypeReader";
import type { TextProps } from "./types";
import { AmountText } from "./AmountText";
import { NeutralText } from "./NeutralText";
import { SettingsLabel } from "./SettingsLabel";
import { TokenLabel } from "./TokenLabel";
import { DistributionLabel } from "./DistributionLabel";
import { AliasLabel } from "./AliasLabel";

interface Props extends Transaction {
  transactionReadableType?: AvailableTransactionString;
  isNeutral?: boolean;
  isSender?: boolean;
}

export const SummaryLabel = ({
  transaction,
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
  // I had to read each transaction attachment onchain and show it properly on the UI :D

  const Summary = useMemo(() => {
    switch (transactionReadableType) {
      case "Ordinary":
      case "SmartContractPayment": {
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
            {amountNQT !== "0" && (
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

      case "AssetMultiTransfer": {
        let amounts: TextProps[] = [];

        if (amountNQT !== "0") {
          amounts.push({ isSender, value: amountNQT });
        }

        attachment.assetIds.map((assetId: string, index: number) => {
          amounts.push({
            isSender,
            tokenId: assetId,
            value: attachment.quantitiesQNT[index],
          });
        });

        return (
          <Fragment>
            {amounts.map((amount, key) => (
              <AmountText key={key} {...amount} />
            ))}
          </Fragment>
        );
      }

      case "AliasAssignment": {
        return (
          <AliasLabel
            aliasName={attachment?.alias ?? ""}
            tldId={attachment?.tld ?? ""}
          />
        );
      }

      case "AssetIssuance": {
        return <NeutralText value={attachment?.name ?? ""} />;
      }

      case "AskOrderPlacement":
      case "BidOrderPlacement":
      case "AssetMint": {
        return (
          <AmountText
            isSender={isSender}
            tokenId={attachment.asset}
            value={attachment.quantityQNT}
          />
        );
      }

      case "AssetDistributeToHolders": {
        let content = (
          <>
            {amountNQT !== "0" && (
              <AmountText isSender={isSender} value={amountNQT} />
            )}

            {!!attachment?.assetToDistribute &&
              attachment.assetToDistribute !== "0" && (
                <AmountText
                  isSender={isSender}
                  tokenId={attachment.assetToDistribute}
                  value={attachment.quantityQNT}
                />
              )}
          </>
        );

        if (!isSender) {
          content = (
            <DistributionLabel
              transaction={transaction}
              assetToDistribute={attachment?.assetToDistribute}
            />
          );
        }

        return (
          <Fragment>
            <TokenLabel tokenId={attachment.asset} action="overview.holders" />

            {content}
          </Fragment>
        );
      }

      case "AddCommitment":
      case "RemoveCommitment": {
        return <AmountText isSigna value={attachment.amountNQT} />;
      }

      default:
        return <SettingsLabel />;
    }
  }, [
    transactionReadableType,
    accountId,
    amountNQT,
    isNeutral,
    attachment,
    isSender,
  ]);

  return <Fragment>{Summary}</Fragment>;
};
