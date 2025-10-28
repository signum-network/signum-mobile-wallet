import { useMemo } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import * as schema from "@/db/schema";

export const useDatabase = () => {
  const sqlite = useSQLiteContext();

  const drizzleDb = useMemo(() => drizzle(sqlite, { schema }), [sqlite]);

  useDrizzleStudio(sqlite);

  return drizzleDb;
};
