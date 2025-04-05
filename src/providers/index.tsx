import { Suspense } from "react";
import { TranslationsProvider } from "./TranslationsProvider";
import { ThemeProvider } from "./ThemeProvider";
import { DataInitializer } from "./DataInitializer";
import { DatabaseProvider } from "./Database/Provider";
import type { ChildrenProps } from "@/types/childrenProps";

export const AppProviders = ({ children }: ChildrenProps) => (
  <Suspense>
    <TranslationsProvider>
      <ThemeProvider>
        <DatabaseProvider>
          <DataInitializer>{children}</DataInitializer>
        </DatabaseProvider>
      </ThemeProvider>
    </TranslationsProvider>
  </Suspense>
);
