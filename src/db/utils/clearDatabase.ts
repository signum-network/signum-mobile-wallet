import type { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { sql } from "drizzle-orm";
import * as schema from "@/db/schema";

export const clearDatabase = async (
  db: ExpoSQLiteDatabase<typeof schema>
): Promise<void> => {
  try {
    console.log("Clearing database...");
    const tables = await db.all<{ name: string }>(
      sql`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '__drizzle%'`
    );
    for (const { name } of tables) {
      console.log(`Clearing table: ${name}...`);
      await db.run(sql`DELETE FROM ${sql.identifier(name)}`);
    }
  } catch (error) {
    console.error("Error clearing database:", error);
    throw error;
  }
};
