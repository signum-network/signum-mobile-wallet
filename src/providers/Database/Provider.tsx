import { useEffect, type ReactNode } from "react";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { SQLiteProvider, openDatabaseSync } from "expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { DATABASE_NAME } from "./name";

import migrations from "@/db/drizzle/migrations";
import * as SplashScreen from "expo-splash-screen";

const expoDb = openDatabaseSync(DATABASE_NAME);

export const DatabaseProvider = ({ children }: { children: ReactNode }) => {
  const db = drizzle(expoDb);

  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (!success || error) return;

    SplashScreen.hideAsync();
  }, [success]);

  return (
    <SQLiteProvider
      databaseName={DATABASE_NAME}
      options={{ enableChangeListener: true }}
    >
      {children}
    </SQLiteProvider>
  );
};
