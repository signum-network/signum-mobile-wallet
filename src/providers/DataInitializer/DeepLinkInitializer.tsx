import {useEffect, useState, useRef, useCallback} from "react";
import {AppState, AppStateStatus, Linking} from "react-native";
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
    const {currentNetwork} = useNodeHostStore();
    const {accounts} = useAccountStore();
    const {isUnlocked} = useAppStore();
    const {t} = useTranslation();
    const {setPendingDeepLink, pendingDeepLink} = pendingDeepLinkStore();
    const [routingRequested, setRoutingRequested] = useState(false);
    const lastProcessedUrl = useRef<string | null>(null);
    const handleDeepLinkRef = useRef<(url: string) => void>(() => {});
    const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

    useEffect(() => {
        const sub = AppState.addEventListener("change", setAppState);
        return () => sub.remove();
    }, []);

    useEffect(() => {

        // Handle deep link when app opens from closed state
        Linking.getInitialURL().then((url) => {
            if (url && url !== lastProcessedUrl.current) {
                lastProcessedUrl.current = url;
                handleDeepLinkRef.current(url);
            }
        })

        // Handle deep link when app is already open
        const subscription = Linking.addEventListener("url", ({url}) => {
            console.log('[DeepLink] Received URL:', url);
            if (url !== lastProcessedUrl.current) {
                lastProcessedUrl.current = url;
                handleDeepLinkRef.current(url);
            }

        });
        return () => subscription.remove();
    }, []);

    useEffect(() => {
        if (routingRequested && isUnlocked && pendingDeepLink && appState === "active") {
            console.log('[DeepLink] Navigating to pending deep link:', pendingDeepLink.pathname, 'with params:', pendingDeepLink.params);
            setRoutingRequested(false);
            router.push(pendingDeepLink.pathname as any);
        }
    }, [pendingDeepLink, isUnlocked, routingRequested, appState, router]);


    const handleDeepLink = useCallback((url: string) => {
        try {
            if (!url.startsWith("signum://") || url.includes(EXPO_DEVELOPMENT_CLIENT)) {
                return;
            }

            console.log('[DeepLink] Processing URL:', url);

            const parsed = src22.parseDeeplink(url);

            if (parsed.action === "sign" && parsed.decodedPayload) {
                const payload = parsed.decodedPayload as any;
                console.log('[DeepLink] Sign payload:', payload);
                if (!payload) {
                    throw Error(t("deeplink.missingUnsignedTransactionBytes"))
                }
                const {unsignedTransactionBytes, network = "", callbackUrl, nodeHost = ""} = payload;
                if (!unsignedTransactionBytes) {
                    throw new Error(t("deeplink.missingUnsignedTransactionBytes"))
                }
                if (network && network !== currentNetwork) {
                    throw new Error(t("deeplink.networkMismatch", {currentNetwork, requestedNetwork: network}));
                }
                if (!callbackUrl) {
                    throw new Error(t("deeplink.missingCallback"))
                }

                if(nodeHost){
                    // assert node host url
                    new URL(nodeHost);
                }

                // assert Url
                new URL(callbackUrl);

                console.log('[DeepLink] Storing sign request as pending');
                setPendingDeepLink({
                    pathname: "/dashboard/deeplink/sign" as const,
                    params: {
                        transactionBytes: unsignedTransactionBytes,
                        callbackUrl,
                        nodeHost,
                    },
                });
                setRoutingRequested(true);
            } else if (parsed.action === "connect" && parsed.decodedPayload) {
                const payload = parsed.decodedPayload as any;
                console.log('[DeepLink] Connect payload:', payload);
                const {appName, callbackUrl, network = ""} = payload;

                if (!appName) {
                    throw new Error(t("deeplink.missingAppName"))
                }

                if (!callbackUrl) {
                    throw new Error(t("deeplink.missingCallback"))
                }

                if (network && network !== currentNetwork) {
                    throw new Error(t("deeplink.networkMismatch", {currentNetwork, requestedNetwork: network}));
                }

                // assert Url
                new URL(callbackUrl);
                const publicKeys = Object.values(accounts)
                    .filter((walletAccount) => walletAccount.type === "mnemonic")
                    .map((walletAccount) => walletAccount.publicKey)

                if (publicKeys.length === 0) {
                    throw new Error(t("deeplink.noMnemonicAccounts"));
                }

                console.log('[DeepLink] Storing connect request as pending');
                setPendingDeepLink({
                    pathname: "/dashboard/deeplink/connect" as const,
                    params: {
                        appName,
                        callbackUrl,
                        network
                    }
                });
                setRoutingRequested(true);
            } else if (parsed.action === "pay" && parsed.decodedPayload) {
                const payload = parsed.decodedPayload as any;
                console.log('[DeepLink] Pay payload:', payload);
                const {amountPlanck, recipient, message, messageIsText, encrypt} = payload;

                setPendingDeepLink({
                    pathname: "/dashboard/overview/send" as const,
                    params: {
                        amountPlanck,
                        recipient,
                        message,
                        messageIsText,
                        encrypt,
                    }
                });
                setRoutingRequested(true);
            }
            else {
                throw new Error(t("deeplink.unsupportedAction", {action: parsed.action}));
            }
        } catch (error: any) {
            console.error("Deep link parsing error:", error);
            alert(t(error.message))
        }
    },[currentNetwork, accounts]);

    // Keep the ref pointing at the latest handleDeepLink so the URL listener
    // (registered once at mount) always invokes the current version and never
    // captures a stale closure over accounts / currentNetwork.
    useEffect(() => {
        handleDeepLinkRef.current = handleDeepLink;
    }, [handleDeepLink]);

    return null;
};
