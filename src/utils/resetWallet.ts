import { deletePin } from "@/utils/sec/handlePin";
import { deleteSecretKey } from "@/utils/sec/handleSecretKeys";
import { accountStore } from "@/states/accountStore";
import { clearDatabase } from "@/db/utils/clearDatabase";
import type { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import * as schema from "@/db/schema";
import { AccountType } from "@/types/account";
import { resetAllStores } from "@/states/storeRegistry";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { queryClient } from "@/providers/DataInitializer";

export const resetWallet = async (
  db: ExpoSQLiteDatabase<typeof schema>
): Promise<void> => {
  console.log("Resetting wallet...");
  // 1. Get accounts before resetting stores
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

  // 4. Clear all persisted data, then reset in-memory state
  // Order matters: clearing AsyncStorage before store reset prevents the persist
  // middleware from re-writing stale state after the clear
  await AsyncStorage.clear();
  resetAllStores();
  queryClient.clear();
};
