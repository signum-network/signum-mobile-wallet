import { Address } from "@signumjs/core";
import { getLedgerService } from "@/utils/getLedgerService";

export const getAccountPublicKey = async (
  account: string
): Promise<string | undefined> => {
  const { ledgerService } = getLedgerService();
  const accountId = Address.create(account).getNumericId();

  try {
    const pk = await ledgerService.account.fetchAccountPublicKey(accountId);
    return pk ?? undefined;
  } catch (e) {
    console.error("[getAccountPublicKey] ledger fetch failed:", e);
    return undefined;
  }
};
