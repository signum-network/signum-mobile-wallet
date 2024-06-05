import { useEffect, type ReactNode } from "react";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";

import { DatabaseContext } from "@/contexts/DatabaseContext";
import { db } from "@/db";
import migrations from "@/db/drizzle/migrations";

import * as SplashScreen from "expo-splash-screen";

export const DatabaseProvider = ({ children }: { children: ReactNode }) => {
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (!success || error) return;

    SplashScreen.hideAsync();
  }, [success]);

  return (
    <DatabaseContext.Provider value={db}>{children}</DatabaseContext.Provider>
  );
};
