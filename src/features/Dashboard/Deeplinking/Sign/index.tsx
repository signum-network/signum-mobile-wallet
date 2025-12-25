import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {ScrollView, View} from "react-native";
import {useRouter} from "expo-router";
import type {Transaction} from "@signumjs/core";
import {useQueryClient} from "@tanstack/react-query";
import {useAccount} from "@/hooks/useAccount";
import {useLedgerService} from "@/hooks/useLedgerService";
import {WatchOnlyAccountCard} from "@/components/Account/WatchOnlyAccountCard";
import {SigningDialog} from "@/components/SigningDialog";
import {Text} from "@/components/Text";
import {Card} from "@/components/Card";
import {Button} from "@/components/Button";
import {readSecretKey} from "@/utils/sec/handleSecretKeys";
import {KeyboardDismissView} from "@/components/KeyboardDismissView";
import {TransactionPreview} from "./sections/TransactionPreview";
import {SuccessSection} from "./sections/SuccessSection";
import {ConfirmationSection} from "./sections/ConfirmationSection";
import {useNodeHostStore} from "@/hooks/useNodeHostStore";
import {pendingDeepLinkStore} from "@/states/pendingDeepLinkStore";

type SignDeeplinkParams = {
    transactionBytes: string;
}


// TODO: translate
export const SignScreen = () => {
    const {t} = useTranslation();
    const router = useRouter();
    const {ledgerService} = useLedgerService();
    const {isWatchOnly, publicKey, accountId} = useAccount();
    const {currentNetwork} = useNodeHostStore();
    const queryClient = useQueryClient();

    const [parsedTx, setParsedTx] = useState<Transaction | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSigning, setIsSigning] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [transactionId, setTransactionId] = useState("");
    const [error, setError] = useState<string | null>(null);
    const {pendingDeepLink, clearPendingDeepLink} = pendingDeepLinkStore()
    const {transactionBytes} = pendingDeepLink?.params as SignDeeplinkParams ?? {};

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
        setError(null);
    }

    const parseTransaction = async (txb: string) => {
        try {
            resetState();
            if (!ledgerService) {
                throw new Error("Ledger service not available");
            }

            const parsed = await ledgerService.account.parseTransactionBytes(txb);

            setParsedTx(parsed as Transaction);
        } catch (err: any) {
            console.error("Failed to parse transaction:", err);
            setError(err?.message || "Failed to parse transaction");
        } finally {
            setIsLoading(false);
            clearPendingDeepLink();
        }
    };

    const handleSign = async () => {
        if (!parsedTx || !ledgerService) return;

        try {
            console.log("Signing transaction...", publicKey);
            const secretKeys = await readSecretKey(publicKey);

            if (!secretKeys) {
                throw new Error("Unable to read secret keys");
            }

            setIsSigning(true);

            const {signPrivateKey} = secretKeys;

            const confirmation =
                await ledgerService.ledgerInstance.transaction.signAndBroadcastTransaction(
                    {
                        unsignedHexMessage: transactionBytes,
                        senderPrivateKey: signPrivateKey,
                        senderPublicKey: publicKey,
                    }
                );

            if (confirmation?.transaction) {
                setTransactionId(confirmation.transaction);
            }

            setIsComplete(true);
            // delay the cache invalidation to get time from network - intentional timeout without cleanup -
            setTimeout(() => {
                queryClient.invalidateQueries({
                    queryKey: ["fetchAccountTransactionsBasicOverview", accountId, currentNetwork],
                })
                resetState();
                router.push('/dashboard/overview')
            }, 5_000)
        } catch (err: any) {
            console.error("Failed to sign transaction:", err);
            alert("Error: " + (err?.message || JSON.stringify(err)));
        } finally {
            setIsSigning(false);
        }
    };

    const handleReject = () => {
        resetState();
        router.back();
    }

    if (isWatchOnly) {
        return (
            <KeyboardDismissView>
                <ScrollView className="flex-1 p-4">
                    <WatchOnlyAccountCard/>
                </ScrollView>
            </KeyboardDismissView>
        );
    }

    if (isLoading) {
        return (
            <KeyboardDismissView>
                <ScrollView className="flex-1 p-4">
                    <Card>
                        <Text className="text-center">{t("Loading transaction...")}</Text>
                    </Card>
                </ScrollView>
            </KeyboardDismissView>
        );
    }

    if (error || !parsedTx) {
        return (
            <KeyboardDismissView>
                <ScrollView className="flex-1 p-4">
                    <Card>
                        <Text className="text-center" color="error">
                            {error || t("Failed to load transaction")}
                        </Text>
                        <Button
                            type="blackout"
                            title={t("Go Back")}
                            pressableProps={{onPress: () => router.back()}}
                            fullWidth
                        />
                    </Card>
                </ScrollView>
            </KeyboardDismissView>
        );
    }

    return (
        <KeyboardDismissView>
            <ScrollView className="flex-1 p-4">
                <SigningDialog visible={isSigning}/>

                <View className="gap-4 w-full">
                    {isComplete && <SuccessSection transactionId={transactionId}/>}

                    <TransactionPreview transaction={parsedTx}/>

                    {!isComplete && (
                        <View className="flex flex-col gap-2">
                            <View>
                                <ConfirmationSection
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
        </KeyboardDismissView>
    );
};
