import "../global.css";
import "@/locales";
import * as Crypto from "expo-crypto";
import { Stack } from "expo-router/stack";
import { AppProviders } from "@/providers";
import "fast-text-encoding";
import * as SplashScreen from "expo-splash-screen";

if (__DEV__) {
  // @ts-expect-error importing modules typing issue
  import("../ReactotronConfig").then(() =>
    console.log("Reactotron Configured")
  );
}

if (!global.crypto) {
  // @ts-expect-error typing issue
  global.crypto = Crypto;
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }} />
    </AppProviders>
  );
}
