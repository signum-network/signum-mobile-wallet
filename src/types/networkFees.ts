import type { SuggestedFees } from "@signumjs/core";

export type networkFees = Omit<
  SuggestedFees,
  "minimum" | "requestProcessingTime"
>;

export const defaultNetworkFees: networkFees = {
  cheap: 0,
  priority: 0,
  standard: 0,
};
