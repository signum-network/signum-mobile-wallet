import { Suspense } from "react";
import { AppTranslationsProvider } from "./AppTranslationsProvider";
import { AppThemeProvider } from "./AppThemeProvider";
import type { ChildrenProps } from "@/types/childrenProps";

export const AppProviders = ({ children }: ChildrenProps) => (
  <Suspense>
    <AppTranslationsProvider>
      <AppThemeProvider>{children}</AppThemeProvider>
    </AppTranslationsProvider>
  </Suspense>
);
