import {
  TransactionType,
  TransactionPaymentSubtype,
  TransactionArbitrarySubtype,
  TransactionAssetSubtype,
  TransactionMiningSubtype,
  TransactionAdvancedPaymentSubtype,
  TransactionSmartContractSubtype,
} from "@signumjs/core";

export type AvailableTransactionString =
  // Payment
  | "Ordinary"
  | "MultiOut"
  | "MultiOutSameAmount"

  // Arbitrary
  | "Message"
  | "AliasAssignment"
  | "AccountInfo"
  | "AliasSale"
  | "AliasBuy"
  | "TopLevelDomainAssignment"

  // Asset
  | "AssetIssuance"
  | "AssetTransfer"
  | "AskOrderPlacement"
  | "BidOrderPlacement"
  | "AskOrderCancellation"
  | "BidOrderCancellation"
  | "AssetMint"
  | "AssetAddTreasureyAccount"
  | "AssetDistributeToHolders"
  | "AssetMultiTransfer"
  | "AssetTransferOwnership"

  // Mining
  | "RewardRecipientAssignment"
  | "AddCommitment"
  | "RemoveCommitment"

  // Subscription
  | "SubscriptionSubscribe"
  | "SubscriptionCancel"
  | "SubscriptionPayment"

  // Smart Contract
  | "SmartContractCreation"
  | "SmartContractPayment";

// Map the transaction types to strings for reading the activity on the multilingual UI
// Not all transaction types/subtypes will be included, just the most known on the chain
// For applying support for further/new transaction types/subtypes, PRs are welcome or create a ticket on the code repository :D

const convertedTransactionStrings = {
  [TransactionType.Payment]: {
    [TransactionPaymentSubtype.Ordinary]: "Ordinary",
    [TransactionPaymentSubtype.MultiOut]: "MultiOut",
    [TransactionPaymentSubtype.MultiOutSameAmount]: "MultiOutSameAmount",
  },
  [TransactionType.Arbitrary]: {
    [TransactionArbitrarySubtype.Message]: "Message",
    [TransactionArbitrarySubtype.AliasAssignment]: "AliasAssignment",
    [TransactionArbitrarySubtype.AccountInfo]: "AccountInfo",
    [TransactionArbitrarySubtype.AliasSale]: "AliasSale",
    [TransactionArbitrarySubtype.AliasBuy]: "AliasBuy",
    [TransactionArbitrarySubtype.TopLevelDomainAssignment]:
      "TopLevelDomainAssignment",
  },
  [TransactionType.Asset]: {
    [TransactionAssetSubtype.AssetIssuance]: "AssetIssuance",
    [TransactionAssetSubtype.AssetTransfer]: "AssetTransfer",
    [TransactionAssetSubtype.AskOrderPlacement]: "AskOrderPlacement",
    [TransactionAssetSubtype.BidOrderPlacement]: "BidOrderPlacement",
    [TransactionAssetSubtype.AskOrderCancellation]: "AskOrderCancellation",
    [TransactionAssetSubtype.BidOrderCancellation]: "BidOrderCancellation",
    [TransactionAssetSubtype.AssetMint]: "AssetMint",
    [TransactionAssetSubtype.AssetAddTreasureyAccount]:
      "AssetAddTreasureyAccount",
    [TransactionAssetSubtype.AssetDistributeToHolders]:
      "AssetDistributeToHolders",
    [TransactionAssetSubtype.AssetMultiTransfer]: "AssetMultiTransfer",
    [TransactionAssetSubtype.AssetTransferOwnership]: "AssetTransferOwnership",
  },
  //   [TransactionType.Marketplace]: {},
  //   [TransactionType.Leasing]: {},
  [TransactionType.Mining]: {
    [TransactionMiningSubtype.RewardRecipientAssignment]:
      "RewardRecipientAssignment",
    [TransactionMiningSubtype.AddCommitment]: "AddCommitment",
    [TransactionMiningSubtype.RemoveCommitment]: "RemoveCommitment",
  },
  [TransactionType.AdvancedPayment]: {
    [TransactionAdvancedPaymentSubtype.SubscriptionSubscribe]:
      "SubscriptionSubscribe",
    [TransactionAdvancedPaymentSubtype.SubscriptionCancel]:
      "SubscriptionCancel",
    [TransactionAdvancedPaymentSubtype.SubscriptionPayment]:
      "SubscriptionPayment",
  },
  [TransactionType.SmartContract]: {
    [TransactionSmartContractSubtype.SmartContractCreation]:
      "SmartContractCreation",
    [TransactionSmartContractSubtype.SmartContractPayment]:
      "SmartContractPayment",
  },
};

// It should return an AvailableTransactionString or just an undefined if there is no transaction type/subtype supported
export const transactionTypeReader = (
  type: number,
  subType: number
): AvailableTransactionString | undefined => {
  // @ts-expect-error read above
  if (!convertedTransactionStrings[type]) return;

  // @ts-expect-error read above
  return convertedTransactionStrings[type][subType] ?? undefined;
};
