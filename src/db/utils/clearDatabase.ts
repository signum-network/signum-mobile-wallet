import type { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import * as schema from "@/db/schema";

export const clearDatabase = async (
  db: ExpoSQLiteDatabase<typeof schema>
): Promise<void> => {
  try {
    // Delete in order - cascading deletes will handle tokensTransactionalData
    await db.delete(schema.tokens);
    await db.delete(schema.distributionAmounts);
  } catch (error) {
    console.error("Error clearing database:", error);
    throw error;
  }
};
