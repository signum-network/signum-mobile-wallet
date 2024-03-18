import { asAddress } from "./asAddress";

export const asRSAddress = (accountId: string): string | null => {
  try {
    return asAddress(accountId).getReedSolomonAddress();
  } catch (error) {
    return null;
  }
};
