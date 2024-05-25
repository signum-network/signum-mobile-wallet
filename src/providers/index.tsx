import { Suspense } from "react";
import { TranslationsProvider } from "./TranslationsProvider";
import { ThemeProvider } from "./ThemeProvider";
import { DataInitializer } from "./DataInitializer";
import { DatabaseProvider } from "./DatabaseProvider";
import type { ChildrenProps } from "@/types/childrenProps";

export const AppProviders = ({ children }: ChildrenProps) => (
  <Suspense>
    <TranslationsProvider>
      <ThemeProvider>
        <DataInitializer>
          <DatabaseProvider>{children}</DatabaseProvider>
        </DataInitializer>
      </ThemeProvider>
    </TranslationsProvider>
  </Suspense>
);
