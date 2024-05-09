import {
  TransactionType,
  TransactionPaymentSubtype,
  TransactionArbitrarySubtype,
  TransactionAssetSubtype,
  TransactionMiningSubtype,
  TransactionEscrowSubtype,
  TransactionSmartContractSubtype,
} from "@signumjs/core";

export type AvailableTransactionString =
  // Payment
  | "OrdinaryPayment"
  | "MultipleRecipients"

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
  | "AddCommitment"
  | "RemoveCommitment"
  | "RewardRecipientAssignment"

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
    [TransactionPaymentSubtype.MultiOut]: "MultipleRecipients",
    [TransactionPaymentSubtype.MultiOutSameAmount]: "MultipleRecipients",
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
    [TransactionMiningSubtype.AddCommitment]: "AddCommitment",
    [TransactionMiningSubtype.RemoveCommitment]: "RemoveCommitment",
    [TransactionMiningSubtype.RewardRecipientAssignment]:
      "RewardRecipientAssignment",
  },
  [TransactionType.Escrow]: {
    [TransactionEscrowSubtype.SubscriptionSubscribe]: "SubscriptionSubscribe",
    [TransactionEscrowSubtype.SubscriptionCancel]: "SubscriptionCancel",
    [TransactionEscrowSubtype.SubscriptionPayment]: "SubscriptionPayment",
  },
  [TransactionType.AT]: {
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
