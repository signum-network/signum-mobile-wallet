import {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {ScrollView, View, ActivityIndicator, Linking} from "react-native";
import {useRouter} from "expo-router";
import {type Transaction} from "@signumjs/core";
import {useQueryClient} from "@tanstack/react-query";
import {useLedgerService} from "@/hooks/useLedgerService";
import {SigningDialog} from "@/components/SigningDialog";
import {Text} from "@/components/Text";
import {Card} from "@/components/Card";
import {Button} from "@/components/Button";
import {readSecretKey} from "@/utils/sec/handleSecretKeys";
import {KeyboardDismissView} from "@/components/KeyboardDismissView";
import {SuccessSection} from "./sections/SuccessSection";
import {useNodeHostStore} from "@/hooks/useNodeHostStore";
import {pendingDeepLinkStore} from "@/states/pendingDeepLinkStore";
import {TransactionPreviewSection} from "./sections/TransactionPreviewSection";
import {useAppTheme} from "@/hooks/useAppTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import {ConfirmationCard} from "@/components/ConfirmationCard";
import {SigningAccountCard} from "./components/SigningAccountCard";

type SignDeeplinkParams = {
    transactionBytes: string;
    callbackUrl: string;
}

type SignError = {
    messageKey: string;
    values?: Record<string, string>;
    detail?: string;
}


function redirectToDApp(callbackUrl: URL) {
    const urlString = callbackUrl.toString();
    console.log("[DL-SIGNING] Redirecting to dApp...", urlString);
    return Linking.openURL(urlString);
}

export const SignScreen = () => {
    const {t} = useTranslation();
    const router = useRouter();
    const {ledgerService} = useLedgerService();
    const {currentNetwork} = useNodeHostStore();
    const queryClient = useQueryClient();
    const {iconColor} = useAppTheme();

    const [parsedTx, setParsedTx] = useState<Transaction | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSigning, setIsSigning] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [transactionId, setTransactionId] = useState("");
    const [error, setError] = useState<SignError | null>(null);
    const {pendingDeepLink, clearPendingDeepLink} = pendingDeepLinkStore()
    const {transactionBytes, callbackUrl} = pendingDeepLink?.params as SignDeeplinkParams ?? {};

    // we need to buffer the unsigned bytes, as pendingDeeplink gets wiped upon successful deeplink handling/delivery
    // these are set only on _successfully_ parsed tx.
    const [bufferedDeeplinkParams, setBufferedDeeplinkParams] = useState({
        transactionBytes: "",
        callbackUrl
    });


    useEffect(() => {
        if (transactionBytes) {
            parseTransaction(transactionBytes);
        }

    }, [transactionBytes]);

    function resetState() {
        setParsedTx(null);
        setIsLoading(true);
        setIsSigning(false);
        setIsComplete(false);
        setTransactionId("");
        setBufferedDeeplinkParams({
            transactionBytes: "",
            callbackUrl: ""
        });
        setError(null);
    }

    const parseTransaction = async (txb: string) => {
        try {
            if (!ledgerService) {
                throw new Error("Ledger service not available");
            }
            const parsed = await ledgerService.account.parseTransactionBytes(txb);
            setParsedTx(parsed as Transaction);
            // we are ready to sign now.
            setBufferedDeeplinkParams(prev => ({
                ...prev,
                transactionBytes: txb,
            }));
        } catch (err: any) {
            console.error("Failed to parse transaction:", err);
            setError({messageKey: "sign.errors.parseFailed"});
        } finally {
            setIsLoading(false);
            // only clear if the store still holds OUR deeplink - a newer one
            // that arrived during parsing must not be wiped
            const currentParams = pendingDeepLinkStore.getState().pendingDeepLink?.params as SignDeeplinkParams | undefined;
            if (currentParams?.transactionBytes === txb) {
                clearPendingDeepLink();
            }
        }
    };

    const sendFailedCallback = () => {
        const callbackUrl = new URL(bufferedDeeplinkParams.callbackUrl);
        callbackUrl.searchParams.set("status", 'failed');
        redirectToDApp(callbackUrl);
    };

    const handleSign = useCallback(async () => {
        if (!parsedTx || !ledgerService || !bufferedDeeplinkParams) return;

        try {
            const {senderPublicKey, sender} = parsedTx;
            console.log("Signing transaction...", senderPublicKey);
            const secretKeys = await readSecretKey(senderPublicKey);
            if (!secretKeys) {
                setError({messageKey: "sign.errors.unknownSigner"});
                sendFailedCallback();
                return;
            }

            throw new Error("Testfehler");

            setIsSigning(true);
            const {signPrivateKey} = secretKeys;
            const confirmation =
                await ledgerService.ledgerInstance.transaction.signAndBroadcastTransaction(
                    {
                        unsignedHexMessage: bufferedDeeplinkParams.transactionBytes,
                        senderPrivateKey: signPrivateKey,
                        senderPublicKey,
                    }
                );

            console.log("[DL-SIGNING] Transaction successfully signed...", confirmation.transaction);

            setTransactionId(confirmation.transaction);
            setIsComplete(true);

            console.log("[DL-SIGNING] Preparing callback...", bufferedDeeplinkParams);
            const callbackUrl = new URL(bufferedDeeplinkParams.callbackUrl);
            callbackUrl.searchParams.set("transactionId", confirmation.transaction);
            callbackUrl.searchParams.set("status", 'success');
            redirectToDApp(callbackUrl)
            // delay the cache invalidation to get time from network - intentional timeout without cleanup -
            setTimeout(() => {
                queryClient.invalidateQueries({
                    queryKey: ["fetchAccountTransactionsBasicOverview", sender, currentNetwork],
                })
                resetState();
                router.push('/dashboard/overview')
            }, 5_000)
        } catch (err: any) {
            console.error("[DL-SIGNING] Failed to sign transaction:", err);
            setError({
                messageKey: "sign.errors.signingFailed",
                detail: err?.message || String(err),
            });
            sendFailedCallback();
        } finally {
            setIsSigning(false);
        }
    }, [parsedTx, bufferedDeeplinkParams, currentNetwork]);

    const handleReject = () => {
        const callbackUrl = new URL(bufferedDeeplinkParams.callbackUrl);
        callbackUrl.searchParams.set("status", 'rejected');
        resetState();
        router.back();
        redirectToDApp(callbackUrl)
    }

    if (isLoading) {
        return (
            <KeyboardDismissView>
                <ScrollView className="flex-1 p-4" contentContainerClassName="justify-center">
                    <Card>
                        <View className="items-center gap-4 py-6">
                            <ActivityIndicator size="large" color={iconColor.primary}/>
                            <View className="gap-2">
                                <Text className="text-center text-lg font-semibold">
                                    {t("sign.loadingTitle")}
                                </Text>
                                <Text className="text-center opacity-70">
                                    {t("sign.loadingDescription")}
                                </Text>
                            </View>
                        </View>
                    </Card>
                </ScrollView>
            </KeyboardDismissView>
        );
    }

    if (error || !parsedTx) {
        return (
            <KeyboardDismissView>
                <ScrollView className="flex-1 p-4" contentContainerClassName="justify-center">
                    <Card>
                        <View className="items-center gap-6 py-6">
                            <View className="items-center gap-3">
                                <Ionicons
                                    name="alert-circle-outline"
                                    size={64}
                                    color="#ef4444"
                                />
                                <View className="gap-2">
                                    <Text className="text-center text-lg font-semibold">
                                        {t("sign.errorTitle")}
                                    </Text>
                                    <Text className="text-center opacity-70">
                                        {error ? t(error.messageKey, error.values) : t("sign.errors.parseFailed")}
                                    </Text>
                                </View>
                            </View>
                            <Button
                                type="blackout"
                                title={t("sign.errorGoBack")}
                                pressableProps={{onPress: () => router.back()}}
                                fullWidth
                            />
                        </View>
                    </Card>
                </ScrollView>
            </KeyboardDismissView>
        );
    }

    return (
        <ScrollView className="flex-1 p-4">
            <SigningDialog visible={isSigning}/>

            <View className="gap-4 w-full">
                {isComplete && <SuccessSection transactionId={transactionId}/>}

                <SigningAccountCard publicKey={parsedTx.senderPublicKey}/>

                <TransactionPreviewSection transaction={parsedTx}/>

                {!isComplete && (
                    <View className="flex flex-col gap-2">
                        <View>
                            <ConfirmationCard
                                onConfirm={handleSign}
                                isDisabled={isSigning}
                            />
                        </View>
                        <View>
                            <Button
                                type="secondary"
                                title={t("connectDApp.reject")}
                                pressableProps={{onPress: handleReject}}
                                fullWidth
                                disabled={isSigning}
                            />
                        </View>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};
