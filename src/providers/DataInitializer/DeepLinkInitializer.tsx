import {useEffect} from "react";
import {Linking} from "react-native";
import {useRouter, usePathname} from "expo-router";
import {useTranslation} from "react-i18next";
import {src22} from "@signumjs/standards";
import {useNodeHostStore} from "@/hooks/useNodeHostStore";
import {useAccountStore} from "@/hooks/useAccountStore";
import {pendingDeepLinkStore} from "@/states/pendingDeepLinkStore";

const EXPO_DEVELOPMENT_CLIENT = "expo-development-client";

export const DeepLinkInitializer = () => {
    const router = useRouter();
    const pathname = usePathname();
    const {currentNetwork} = useNodeHostStore()
    const {accounts} = useAccountStore();
    const {t} = useTranslation();
    const {setPendingDeepLink} = pendingDeepLinkStore();

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

            // Check if app is locked
            const isLocked = pathname === "/auth/login";

            // Parse deep link using SignumJS SRC22 parser
            const parsed = src22.parseDeeplink(url);

            if (parsed.action === "sign" && parsed.decodedPayload) {

                const payload = parsed.decodedPayload as any;
                if (!payload) {
                    console.error("Missing unsignedTransactionBytes in payload");
                    alert(t("deeplink.missingUnsignedTransactionBytes"))
                    return;
                }

                const {unsignedTransactionBytes, network = ""} = payload;
                if (!unsignedTransactionBytes) {
                    console.error("Missing unsignedTransactionBytes in payload");
                    alert(t("deeplink.missingUnsignedTransactionBytes"))
                    return;
                }
                if (network && network !== currentNetwork) {
                    console.error("Network mismatch in payload - got ", network, " expected ", currentNetwork, "");
                    alert(t("deeplink.networkMismatch", {currentNetwork, requestedNetwork: network}));
                    return;
                }

                // If app is locked, store the deep link for later
                if (isLocked) {
                    setPendingDeepLink({
                        pathname: "/dashboard/deeplink/sign",
                        params: {transactionBytes: unsignedTransactionBytes},
                    });
                    return;
                }

                // Navigate to sign screen
                router.push({
                    pathname: "/dashboard/deeplink/sign",
                    params: {transactionBytes: unsignedTransactionBytes},
                });
            } else if (parsed.action === "connect" && parsed.decodedPayload) {
                const payload = parsed.decodedPayload as any;
                console.log('[DeepLink] Connect payload:', payload);
                const {appName, callbackUrl, network = ""} = payload;
                console.log('[DeepLink] Extracted:', { appName, callbackUrl, network });
                if (!appName) {
                    console.error("Missing appName in payload");
                    alert(t("deeplink.missingAppName"))
                    return;
                }

                if (!callbackUrl) {
                    console.error("Missing callbackUrl in payload");
                    alert(t("deeplink.missingCallback"))
                    return;
                }


                if (network && network !== currentNetwork) {
                    console.error("Network mismatch in payload - got ", network, " expected ", currentNetwork, "");
                    alert(t("deeplink.networkMismatch", {currentNetwork, requestedNetwork: network}));
                    return;
                }

                // assert Url
                new URL(callbackUrl);

                const publicKeys = Object.values(accounts)
                    .filter((walletAccount) => walletAccount.type === "mnemonic")
                    .map((walletAccount) => walletAccount.publicKey)

                if (publicKeys.length === 0) {
                    console.error("No mnemonic accounts found in wallet");
                    alert(t("deeplink.noMnemonicAccounts"));
                    return;
                }

                // If app is locked, store the deep link for later
                if (isLocked) {
                    setPendingDeepLink({
                        pathname: "/dashboard/deeplink/connectDapp",
                        params: {
                            appName,
                            callbackUrl,
                            network
                        }
                    });
                    return;
                }

                // Navigate to connection approval screen
                router.push({
                    pathname: "/dashboard/deeplink/connectDapp",
                    params: {
                        appName,
                        callbackUrl,
                        network
                    }
                });
            }
            else {
                alert(t("deeplink.unsupportedAction", { action: parsed.action }));
            }
        } catch (error) {
            console.error("Deep link parsing error:", error);
        }
    };

    return null;
};
