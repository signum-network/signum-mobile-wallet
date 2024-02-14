import "../global.css";
import "@/locales";
import { Stack } from "expo-router/stack";
import { AppProviders } from "@/providers";
import * as SplashScreen from "expo-splash-screen";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="terms" />
        <Stack.Screen name="auth" />
      </Stack>
    </AppProviders>
  );
}
