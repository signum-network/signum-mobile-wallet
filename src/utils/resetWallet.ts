import { deletePin } from "@/utils/sec/handlePin";
import { deleteSecretKey } from "@/utils/sec/handleSecretKeys";
import { appStore } from "@/states/appStore";
import { accountStore } from "@/states/accountStore";
import { marketStore } from "@/states/marketStore";
import { topLevelDomainStore } from "@/states/topLevelDomainStore";
import { recipientsStore } from "@/states/recipientsStore";
import { clearDatabase } from "@/db/utils/clearDatabase";
import type { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import * as schema from "@/db/schema";
import { AccountType } from "@/types/account";

export const resetWallet = async (
  db: ExpoSQLiteDatabase<typeof schema>
): Promise<void> => {
  // 1. Get accounts before resetting store
  const accounts = accountStore.getState().accounts;
  const secretKeyDeletionPromises: Promise<boolean>[] = [];

  Object.values(accounts).forEach((account) => {
    if (account.type === AccountType.mnemonic) {
      secretKeyDeletionPromises.push(deleteSecretKey(account.publicKey));
    }
  });

  // 2. Delete PIN and secret keys
  await deletePin();
  await Promise.allSettled(secretKeyDeletionPromises);

  // 3. Clear database
  await clearDatabase(db);

  // 4. Reset all Zustand stores
  appStore.getState().reset();
  marketStore.getState().reset();
  topLevelDomainStore.getState().reset();
  recipientsStore.getState().clear();

  // Note: Reset accountStore LAST because we need account data above
  accountStore.getState().reset();
};
