import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import { DATABASE_NAME } from "@/providers/Database/name";

// Connection used only OUTSIDE of hooks
const expoDb = openDatabaseSync(DATABASE_NAME);

export const db = drizzle(expoDb);
