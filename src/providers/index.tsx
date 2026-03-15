import {Suspense} from "react";
import {TranslationsProvider} from "./TranslationsProvider";
import {ThemeProvider} from "./ThemeProvider";
import {DataInitializer} from "./DataInitializer";
import {DatabaseProvider} from "./Database/Provider";
import type {ChildrenProps} from "@/types/childrenProps";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {ErrorBoundary as AppErrorBoundary} from "@/components/ErrorBoundary";


export const AppProviders = ({children}: ChildrenProps) => (
    <SafeAreaProvider>
        <Suspense>
            <TranslationsProvider>
                <ThemeProvider>
                    <DatabaseProvider>
                        <AppErrorBoundary>
                            <DataInitializer>
                                {children}
                            </DataInitializer>
                        </AppErrorBoundary>
                    </DatabaseProvider>
                </ThemeProvider>
            </TranslationsProvider>
        </Suspense>
    </SafeAreaProvider>
);
