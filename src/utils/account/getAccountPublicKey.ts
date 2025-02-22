import { eq } from "drizzle-orm";
import { db } from "@/db/get";
import { accountPublicKeys } from "@/db/schema";
import { getLedgerService } from "@/utils/getLedgerService";
import { asAddress } from "./asAddress";

export const getAccountPublicKey = async (account: string) => {
  const { ledgerService } = getLedgerService();
  const accountID = asAddress(account).getNumericId();

  const query = await db
    .select()
    .from(accountPublicKeys)
    .where(eq(accountPublicKeys.account, accountID));

  const row = !!query.length && query[0];

  if (row) return row.publicKey;

  try {
    const accountPublicKey = await ledgerService.account.fetchAccountPublicKey(
      accountID
    );

    if (!accountPublicKey) return undefined;

    await db
      .insert(accountPublicKeys)
      .values({ account, publicKey: accountPublicKey });

    return accountPublicKey;
  } catch (_e) {
    return undefined;
  }
};
