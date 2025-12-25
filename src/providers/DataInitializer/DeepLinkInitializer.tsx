import {useEffect, useState, useRef} from "react";
import {Linking} from "react-native";
import {useRouter} from "expo-router";
import {useTranslation} from "react-i18next";
import {src22} from "@signumjs/standards";
import {useNodeHostStore} from "@/hooks/useNodeHostStore";
import {useAccountStore} from "@/hooks/useAccountStore";
import {useAppStore} from "@/hooks/useAppStore";
import {pendingDeepLinkStore} from "@/states/pendingDeepLinkStore";

const EXPO_DEVELOPMENT_CLIENT = "expo-development-client";

export const DeepLinkInitializer = () => {
    const router = useRouter();
    const {currentNetwork} = useNodeHostStore()
    const {accounts} = useAccountStore();
    const {isUnlocked} = useAppStore();
    const {t} = useTranslation();
    const {setPendingDeepLink, pendingDeepLink} = pendingDeepLinkStore();
    const [routingRequested, setRoutingRequested] = useState(false);
    const lastProcessedUrl = useRef<string | null>(null);
    useEffect(() => {
        // Handle deep link when app is already open
        const subscription = Linking.addEventListener("url", ({url}) => {
            console.log('[DeepLink] Received URL:', url);
            if (url !== lastProcessedUrl.current) {
                lastProcessedUrl.current = url;
                handleDeepLink(url);
            }
            // Handle deep link when app opens from closed state
            Linking.getInitialURL().then((url) => {
                if (url && url !== lastProcessedUrl.current) {
                    lastProcessedUrl.current = url;
                    handleDeepLink(url);
                }
            })
        });
        return () => subscription.remove();
    }, []);

    useEffect(() => {
        if (routingRequested && isUnlocked && pendingDeepLink) {
            console.log('[DeepLink] Navigating to pending deep link:', pendingDeepLink.pathname, 'with params:', pendingDeepLink.params);
            setRoutingRequested(false)
            router.push( pendingDeepLink.pathname as any);
        }
    }, [pendingDeepLink, isUnlocked, routingRequested, setRoutingRequested]);


    const handleDeepLink = (url: string) => {
        try {
            if (!url.startsWith("signum://") || url.includes(EXPO_DEVELOPMENT_CLIENT)) {
                return;
            }

            console.log('[DeepLink] Processing URL:', url);

            // Parse deep link using SignumJS SRC22 parser
            const parsed = src22.parseDeeplink(url);

            if (parsed.action === "sign" && parsed.decodedPayload) {
                const payload = parsed.decodedPayload as any;
                console.log('[DeepLink] Sign payload:', payload);
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

                console.log('[DeepLink] Storing sign request as pending');
                setPendingDeepLink({
                    pathname: "/dashboard/deeplink/sign" as const,
                    params: {transactionBytes: unsignedTransactionBytes},
                });
                setRoutingRequested(true);
            } else if (parsed.action === "connect" && parsed.decodedPayload) {
                const payload = parsed.decodedPayload as any;
                console.log('[DeepLink] Connect payload:', payload);
                const {appName, callbackUrl, network = ""} = payload;
                console.log('[DeepLink] Extracted:', {appName, callbackUrl, network});
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


                console.log('[DeepLink] Storing connect request as pending');
                setPendingDeepLink({
                    pathname: "/dashboard/deeplink/connectDapp" as const,
                    params: {
                        appName,
                        callbackUrl,
                        network
                    }
                });
                setRoutingRequested(true);
            } else {
                alert(t("deeplink.unsupportedAction", {action: parsed.action}));
            }
        } catch (error) {
            console.error("Deep link parsing error:", error);
        }
    };

    return null;
};
