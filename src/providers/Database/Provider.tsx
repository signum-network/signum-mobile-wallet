import { type ReactNode, useEffect, useMemo } from "react";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import * as SplashScreen from "expo-splash-screen";
import migrations from "@/db/drizzle/migrations";
import { DATABASE_NAME } from "./name";

function MigrationGate({ children }: { children: ReactNode }) {

  const sqliteDb = useSQLiteContext();
  const db = useMemo(() => drizzle(sqliteDb), [sqliteDb]);

  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (success && !error) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [success, error]);

  // // Do not render anything while the migration is running (splash visible)
  if (!success && !error) return null;

  return <>{children}</>;
}

export const DatabaseProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SQLiteProvider
      databaseName={DATABASE_NAME}
      options={{ enableChangeListener: false }}
    >
      <MigrationGate>{children}</MigrationGate>
    </SQLiteProvider>
  );
};
