import "../global.css";
import "@/locales";
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
