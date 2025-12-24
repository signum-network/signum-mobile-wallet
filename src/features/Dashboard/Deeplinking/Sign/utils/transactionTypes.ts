/**
 * Transaction Type and Subtype constants from SignumJS
 * Reference: @signumjs/core/out/constants
 */

export enum TransactionType {
  Payment = 0,
  Arbitrary = 1,
  Asset = 2,
  Marketplace = 3,
  Leasing = 4,
  Mining = 20,
  AdvancedPayment = 21,
  SmartContract = 22,
}

export enum TransactionPaymentSubtype {
  Ordinary = 0,
  MultiOut = 1,
  MultiOutSameAmount = 2,
}

export enum TransactionArbitrarySubtype {
  Message = 0,
  AliasAssignment = 1,
  PollCreation = 2,
  VoteCasting = 3,
  HubAnnouncement = 4,
  AccountInfo = 5,
  AliasSale = 6,
  AliasBuy = 7,
  TopLevelDomainAssignment = 8,
}

export enum TransactionAssetSubtype {
  AssetIssuance = 0,
  AssetTransfer = 1,
  AskOrderPlacement = 2,
  BidOrderPlacement = 3,
  AskOrderCancellation = 4,
  BidOrderCancellation = 5,
  AssetMint = 6,
  AssetAddTreasureyAccount = 7,
  AssetDistributeToHolders = 8,
  AssetMultiTransfer = 9,
  AssetTransferOwnership = 10,
}

export enum TransactionMarketplaceSubtype {
  MarketplaceListing = 0,
  MarketplaceRemoval = 1,
  MarketplaceItemPriceChange = 2,
  MarketplaceItemQuantityChange = 3,
  MarketplacePurchase = 4,
  MarketplaceDelivery = 5,
  MarketplaceFeedback = 6,
  MarketplaceRefund = 7,
}

export enum TransactionLeasingSubtype {
  Ordinary = 0,
}

export enum TransactionMiningSubtype {
  RewardRecipientAssignment = 0,
  AddCommitment = 1,
  RemoveCommitment = 2,
}

export enum TransactionAdvancedPaymentSubtype {
  EscrowCreation = 0,
  EscrowSigning = 1,
  EscrowResult = 2,
  SubscriptionSubscribe = 3,
  SubscriptionCancel = 4,
  SubscriptionPayment = 5,
}

export enum TransactionSmartContractSubtype {
  SmartContractCreation = 0,
  SmartContractPayment = 1,
}

/**
 * Get human-readable name for transaction type
 */
export function getTransactionTypeName(type: number, subtype: number): string {
  switch (type) {
    case TransactionType.Payment:
      switch (subtype) {
        case TransactionPaymentSubtype.Ordinary:
          return "Payment";
        case TransactionPaymentSubtype.MultiOut:
          return "Multi-Out Payment";
        case TransactionPaymentSubtype.MultiOutSameAmount:
          return "Multi-Out Same Amount";
        default:
          return "Payment";
      }

    case TransactionType.Arbitrary:
      switch (subtype) {
        case TransactionArbitrarySubtype.Message:
          return "Message";
        case TransactionArbitrarySubtype.AliasAssignment:
          return "Alias Assignment";
        case TransactionArbitrarySubtype.PollCreation:
          return "Poll Creation";
        case TransactionArbitrarySubtype.VoteCasting:
          return "Vote Casting";
        case TransactionArbitrarySubtype.HubAnnouncement:
          return "Hub Announcement";
        case TransactionArbitrarySubtype.AccountInfo:
          return "Account Info";
        case TransactionArbitrarySubtype.AliasSale:
          return "Alias Sale";
        case TransactionArbitrarySubtype.AliasBuy:
          return "Alias Buy";
        case TransactionArbitrarySubtype.TopLevelDomainAssignment:
          return "TLD Assignment";
        default:
          return "Arbitrary";
      }

    case TransactionType.Asset:
      switch (subtype) {
        case TransactionAssetSubtype.AssetIssuance:
          return "Asset Issuance";
        case TransactionAssetSubtype.AssetTransfer:
          return "Asset Transfer";
        case TransactionAssetSubtype.AskOrderPlacement:
          return "Ask Order Placement";
        case TransactionAssetSubtype.BidOrderPlacement:
          return "Bid Order Placement";
        case TransactionAssetSubtype.AskOrderCancellation:
          return "Ask Order Cancellation";
        case TransactionAssetSubtype.BidOrderCancellation:
          return "Bid Order Cancellation";
        case TransactionAssetSubtype.AssetMint:
          return "Asset Mint";
        case TransactionAssetSubtype.AssetAddTreasureyAccount:
          return "Add Treasury Account";
        case TransactionAssetSubtype.AssetDistributeToHolders:
          return "Distribute to Holders";
        case TransactionAssetSubtype.AssetMultiTransfer:
          return "Asset Multi-Transfer";
        case TransactionAssetSubtype.AssetTransferOwnership:
          return "Transfer Ownership";
        default:
          return "Asset";
      }

    case TransactionType.Marketplace:
      switch (subtype) {
        case TransactionMarketplaceSubtype.MarketplaceListing:
          return "Marketplace Listing";
        case TransactionMarketplaceSubtype.MarketplaceRemoval:
          return "Marketplace Removal";
        case TransactionMarketplaceSubtype.MarketplaceItemPriceChange:
          return "Price Change";
        case TransactionMarketplaceSubtype.MarketplaceItemQuantityChange:
          return "Quantity Change";
        case TransactionMarketplaceSubtype.MarketplacePurchase:
          return "Marketplace Purchase";
        case TransactionMarketplaceSubtype.MarketplaceDelivery:
          return "Marketplace Delivery";
        case TransactionMarketplaceSubtype.MarketplaceFeedback:
          return "Marketplace Feedback";
        case TransactionMarketplaceSubtype.MarketplaceRefund:
          return "Marketplace Refund";
        default:
          return "Marketplace";
      }

    case TransactionType.Leasing:
      return "Balance Leasing";

    case TransactionType.Mining:
      switch (subtype) {
        case TransactionMiningSubtype.RewardRecipientAssignment:
          return "Reward Recipient Assignment";
        case TransactionMiningSubtype.AddCommitment:
          return "Add Commitment";
        case TransactionMiningSubtype.RemoveCommitment:
          return "Remove Commitment";
        default:
          return "Mining";
      }

    case TransactionType.AdvancedPayment:
      switch (subtype) {
        case TransactionAdvancedPaymentSubtype.EscrowCreation:
          return "Escrow Creation";
        case TransactionAdvancedPaymentSubtype.EscrowSigning:
          return "Escrow Signing";
        case TransactionAdvancedPaymentSubtype.EscrowResult:
          return "Escrow Result";
        case TransactionAdvancedPaymentSubtype.SubscriptionSubscribe:
          return "Subscription Subscribe";
        case TransactionAdvancedPaymentSubtype.SubscriptionCancel:
          return "Subscription Cancel";
        case TransactionAdvancedPaymentSubtype.SubscriptionPayment:
          return "Subscription Payment";
        default:
          return "Advanced Payment";
      }

    case TransactionType.SmartContract:
      switch (subtype) {
        case TransactionSmartContractSubtype.SmartContractCreation:
          return "Smart Contract Creation";
        case TransactionSmartContractSubtype.SmartContractPayment:
          return "Smart Contract Payment";
        default:
          return "Smart Contract";
      }

    default:
      return `Unknown (${type}.${subtype})`;
  }
}
