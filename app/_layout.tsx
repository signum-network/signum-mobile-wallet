import "../global.css";
import "@/locales";
import "fast-text-encoding";
import * as Crypto from "expo-crypto";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router/stack";
import { AppProviders } from "@/providers";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProviders>
        <Stack screenOptions={{ headerShown: false }} />
      </AppProviders>
    </GestureHandlerRootView>
  );
}
