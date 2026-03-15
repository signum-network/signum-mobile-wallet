/**
 * Maps transaction i18nKeys to Ionicons names
 */
export const TRANSACTION_ICONS: Record<string, string> = {
  // Payment
  transferTo: "arrow-forward",
  burn: "flame",

  // Asset
  tokenIssuance: "create",
  tokenMint: "add-circle",
  createSaleOrder: "cart",
  createBuyOrder: "cart-outline",
  cancelSaleOrder: "close-circle",
  cancelBuyOrder: "close-circle-outline",
  addTreasuryAccount: "business",
  transferOwnership: "swap-horizontal",
  distribution: "git-network",

  // Arbitrary
  messageTo: "mail",
  updateAccountInfo: "information-circle",
  aliasCreation: "person-add",
  aliasBuy: "person",
  aliasSell: "person",

  // Mining
  addCommitment: "trending-up",
  removeCommitment: "trending-down",
  joinPool: "people",

  // Smart Contract
  contractCreation: "code-slash",

  // Advanced Payment
  subscriptionCreation: "time",
  subscriptionCancellation: "close-circle",

  // Generic
  transaction: "swap-horizontal",
};

export function getTransactionIcon(i18nKey: string): string {
  return TRANSACTION_ICONS[i18nKey] || "swap-horizontal";
}
