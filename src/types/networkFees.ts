import { Amount } from "@signumjs/util";

export type networkFees = {
  cheap: Amount;
  standard: Amount;
  priority: Amount;
};

export const defaultNetworkFees: networkFees = {
  cheap: Amount.fromSigna(0),
  standard: Amount.fromSigna(0),
  priority: Amount.fromSigna(0),
};
