import { Suspense } from "react";
import { TranslationsProvider } from "./TranslationsProvider";
import { ThemeProvider } from "./ThemeProvider";
import { DataInitializer } from "./DataInitializer";
import { DatabaseProvider } from "./DatabaseProvider";
import type { ChildrenProps } from "@/types/childrenProps";

export const AppProviders = ({ children }: ChildrenProps) => (
  <Suspense>
    <DatabaseProvider>
      <TranslationsProvider>
        <ThemeProvider>
          <DataInitializer>{children}</DataInitializer>
        </ThemeProvider>
      </TranslationsProvider>
    </DatabaseProvider>
  </Suspense>
);
