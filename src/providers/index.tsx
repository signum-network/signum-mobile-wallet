import { Suspense } from "react";
import { AppTranslationsProvider } from "./AppTranslationsProvider";
import { AppThemeProvider } from "./AppThemeProvider";
import { AppDataInitializer } from "./AppDataInitializer";
import type { ChildrenProps } from "@/types/childrenProps";

export const AppProviders = ({ children }: ChildrenProps) => (
  <Suspense>
    <AppTranslationsProvider>
      <AppThemeProvider>
        <AppDataInitializer>{children}</AppDataInitializer>
      </AppThemeProvider>
    </AppTranslationsProvider>
  </Suspense>
);
