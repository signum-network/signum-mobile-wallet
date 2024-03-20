import { Suspense } from "react";
import { AppTranslationsProvider } from "./AppTranslationsProvider";
import { AppThemeProvider } from "./AppThemeProvider";
import { ChildrenProps } from "@/types/children";

export const AppProviders = ({ children }: ChildrenProps) => (
  <Suspense>
    <AppTranslationsProvider>
      <AppThemeProvider>{children}</AppThemeProvider>
    </AppTranslationsProvider>
  </Suspense>
);
