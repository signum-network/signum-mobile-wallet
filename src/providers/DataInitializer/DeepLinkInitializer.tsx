import {useEffect} from "react";
import {Linking} from "react-native";
import {useRouter} from "expo-router";
import {useTranslation} from "react-i18next";
import {src22} from "@signumjs/standards";

const EXPO_DEVELOPMENT_CLIENT = "expo-development-client";

export const DeepLinkInitializer = () => {
    const router = useRouter();
    const {t} = useTranslation();

    useEffect(() => {
        // Handle deep link when app is already open
        const subscription = Linking.addEventListener("url", ({url}) => {
            handleDeepLink(url);
        });

        // Handle deep link when app opens from closed state
        Linking.getInitialURL().then((url) => {
            if (url) handleDeepLink(url);
        });

        return () => subscription.remove();
    }, []);

    const handleDeepLink = (url: string) => {
        try {
            if (!url.startsWith("signum://") || url.includes(EXPO_DEVELOPMENT_CLIENT)) {
                return;
            }
            // Parse deep link using SignumJS SRC22 parser
            const parsed = src22.parseDeeplink(url);

            if (parsed.action === "sign" && parsed.decodedPayload) {
                const payload = parsed.decodedPayload as any;
                const {unsignedTransactionBytes} = payload;

                if (!unsignedTransactionBytes) {
                    console.error("Missing unsignedTransactionBytes in payload");
                    return;
                }

                // Navigate to sign screen
                router.push({
                    pathname: "/dashboard/sign",
                    params: {transactionBytes: unsignedTransactionBytes},
                });
            } else {
                alert(t("deeplink.unsupportedAction", { action: parsed.action }));
            }
        } catch (error) {
            console.error("Deep link parsing error:", error);
        }
    };

    return null;
};
