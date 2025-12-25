import {useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {Linking, ScrollView, View} from "react-native";
import {useRouter} from "expo-router";
import {useAccountStore} from "@/hooks/useAccountStore";
import {KeyboardDismissView} from "@/components/KeyboardDismissView";
import {Text} from "@/components/Text";
import {Card} from "@/components/Card";
import {Button} from "@/components/Button";
import {AccountCard} from "@/components/Account/AccountCard";
import {Image} from "expo-image";
import {signumBlueSymbolPicture} from "@/assets";
import {pendingDeepLinkStore} from "@/states/pendingDeepLinkStore";

type ConnectSearchParams = {
    appName?: string;
    callbackUrl?: string;
    network?: string;
}


function getFavIcon(url: string) {
    const app = new URL(url)
    return app.protocol + "//" + app.hostname + "/favicon.ico"
}

export const ConnectDAppScreen = () => {
    const {t} = useTranslation();
    const router = useRouter();
    const {accounts, activeAccount} = useAccountStore();
    const [isConnecting, setIsConnecting] = useState(false);

    const walletAccount = useMemo(() => {
        return Object.values(accounts).find(account => account.publicKey === activeAccount);
    }, [accounts, activeAccount]);

    const canConnect = walletAccount?.type === "mnemonic";

    const {pendingDeepLink, clearPendingDeepLink} = pendingDeepLinkStore()
    if (!pendingDeepLink) {
        return null;
    }

    const {appName, callbackUrl, network} = pendingDeepLink.params as ConnectSearchParams;
    console.log("ConnectDAppScreen", {appName, callbackUrl, network})

    // Filter to only mnemonic (full) accounts - watch-only can't sign
    const handleApprove = async () => {
        if (!callbackUrl) return;
        try {
            setIsConnecting(true);
            // Build callback URL with account info
            const url = new URL(callbackUrl);
            url.searchParams.set("publicKey", activeAccount);

            // Open callback URL
            await Linking.openURL(url.toString());
        } catch (error: any) {
            console.error("Failed to connect to dApp:", error);
            alert(t("connectDApp.connectionFailed") + ": " + error.message);
        } finally {
            setIsConnecting(false);
            clearPendingDeepLink()
            router.back()
        }
    };

    const handleReject = () => {
        alert(t('connectDApp.connectionRejected'))
        clearPendingDeepLink()
        router.back()
    };

    if (!walletAccount) {
        return (
            <KeyboardDismissView>
                <ScrollView className="flex-1 p-4">
                    <Card>
                        <Text className="text-center mb-4" color="error">
                            {t("connectDApp.noAccountsAvailable")}
                        </Text>
                        <Text className="text-center mb-4" color="muted">
                            {t("connectDApp.noAccountsDescription")}
                        </Text>
                        <Button
                            type="blackout"
                            title={t("Go Back")}
                            pressableProps={{onPress: handleReject}}
                            fullWidth
                        />
                    </Card>
                </ScrollView>
            </KeyboardDismissView>
        );
    }

    if (!callbackUrl) {
        return (
            <KeyboardDismissView>
                <ScrollView className="flex-1 p-4">
                    <Card>
                        <Text className="text-center mb-4" color="error">
                            {t("connectDApp.noCallback")}
                        </Text>
                        <Text className="text-center mb-4" color="muted">
                            {t("connectDApp.noCallbackDescription")}
                        </Text>
                        <Button
                            type="blackout"
                            title={t("Go Back")}
                            pressableProps={{onPress: handleReject}}
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
                <View className="gap-4 w-full">
                    {/* dApp Info Card */}
                    <Card>
                        <View className="text-center m-auto ">
                            <Text size="large" className="font-bold mb-2">
                                {t("connectDApp.title")}
                            </Text>
                        </View>
                        <View className="flex justify-center items-center m-auto">
                            <Image
                                source={{uri: getFavIcon(callbackUrl || "")}}
                                contentFit="contain"
                                style={{width: 54, height: 54}}
                                onError={() => signumBlueSymbolPicture}
                            />
                            <Text className="font-bold">
                                {appName || t("connectDApp.unknownApp")}
                            </Text>
                        </View>
                        {network && (
                            <View
                                className="mx-auto my-2 border rounded p-2 border-gray-200 dark:border-gray-700 bg-gray-200">
                                <Text>{network.toUpperCase()}</Text>
                            </View>
                        )}
                        <View
                            className="border bg-amber-100 border-yellow-400 dark:border-yellow-600 rounded-lg p-4 mb-4">
                            <Text size="small">
                                {t("connectDApp.securityNotice")}
                            </Text>
                        </View>
                    </Card>

                    {/* Account Selection Card */}
                    <AccountCard
                        publicKey={walletAccount.publicKey}
                        type={walletAccount.type}
                        walletName={walletAccount.walletName}
                    />


                    {/* Action Buttons */}
                    <View style={{flexDirection: 'row', gap: 12}}>
                        <View style={{flex: 1}}>
                            <Button
                                type="secondary"
                                title={t("connectDApp.reject")}
                                pressableProps={{onPress: handleReject}}
                                fullWidth
                                disabled={isConnecting}
                            />
                        </View>
                        <View style={{flex: 1}}>
                            <Button
                                type="primary"
                                title={t("connectDApp.connect")}
                                pressableProps={{onPress: handleApprove}}
                                fullWidth
                                disabled={!canConnect || isConnecting}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardDismissView>
    );
};
