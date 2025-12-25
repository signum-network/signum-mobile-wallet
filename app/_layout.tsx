import "../global.css";
import "@/locales";
import * as ExpoCrypto from "expo-crypto";
import {Crypto} from "@signumjs/crypto";
import {ReactNativeExpoCryptoAdapter} from "@signumjs/react-native-expo-crypto-adapter";
import * as SplashScreen from "expo-splash-screen";
import {Stack} from "expo-router/stack";
import {AppProviders} from "@/providers";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {BottomInsetDecor} from "@/components/BottomInsetDecor";
// import {useFonts} from "expo-font";
import {useFonts, SpaceMono_400Regular} from "@expo-google-fonts/space-mono"

import {useEffect} from "react";

Crypto.init(new ReactNativeExpoCryptoAdapter());

if (__DEV__) {
    import("../ReactotronConfig").then(() =>
        console.log("Reactotron Configured")
    );
}

if (!global.crypto) {
    // @ts-expect-error typing issue
    global.crypto = ExpoCrypto;
}

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Load Ꞩ (SIGNA symbol) for iOS
export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        SpaceMono_400Regular,
        SignumSymbols: require("@/assets/fonts/SignumSymbols.ttf"),
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync().catch(() => {
            });
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <AppProviders>
                    <Stack screenOptions={{headerShown: false}}/>
            </AppProviders>
            <BottomInsetDecor/>
        </GestureHandlerRootView>
    );
}
