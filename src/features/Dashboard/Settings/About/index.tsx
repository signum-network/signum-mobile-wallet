import {View} from "react-native";
import {useTranslation} from "react-i18next";
import {Image} from "expo-image";
import {Card} from "@/components/Card";
import {Text} from "@/components/Text";
import {Button} from "@/components/Button";
import {HorizontalDivider} from "@/components/HorizontalDivider";
import {useAppTheme} from "@/hooks/useAppTheme";
import {signumTransparentSymbol} from "@/assets";
import {AppHeader} from "@/components/AppHeader";

import * as Application from "expo-application";
import * as Linking from "expo-linking";
import {ResetWalletDialog} from "@/components/ResetWalletDialog";

export const AboutScreen = () => {
    const {t} = useTranslation();
    const {tokens} = useAppTheme();

    const openRepositoryPage = async () => {
        await Linking.openURL(
            "https://github.com/signum-network/signum-mobile-wallet"
        );
    };

    const openPrivacyPolicyPage = async () => {
        await Linking.openURL(
            "https://github.com/signum-network/signum-mobile-wallet/blob/develop/PRIVACY.md"
        );
    };

    const contactDeveloper = async () => {
        await Linking.openURL("mailto:development@signum.network");
    };

    return (
        <>
            <AppHeader title={t("settings.about.title")}/>
            <View className="flex flex-1 flex-col items-center w-full px-4 gap-4 pt-4">
                <Card>
                    <View className="flex flex-col items-center justify-center w-full gap-2">
                        <View className="items-center justify-center gap-2 mb-2">
                            <View
                                style={{
                                    width: 75,
                                    height: 75,
                                    borderRadius: 999,
                                    backgroundColor: tokens.primary,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Image
                                    source={{uri: signumTransparentSymbol}}
                                    contentFit="contain"
                                    style={{width: 54, height: 54}}
                                />
                            </View>

                            <Text className="w-full text-center !text-2xl">
                                Signum Mobile Wallet
                            </Text>

                            <Text className="w-full text-center font-medium">
                                {t("settings.about.version", {
                                    version: Application.nativeApplicationVersion ?? "unknown",
                                })}
                            </Text>

                            <Text
                                className="w-full text-center font-medium"
                                color="muted"
                                size="small"
                            >
                                {t("settings.about.nonCustodial")}
                            </Text>
                        </View>

                        <HorizontalDivider/>

                        <Text className="text-center !text-2xl mt-4" color="content">
                            {t("settings.about.links")}
                        </Text>

                        <Button
                            type="link"
                            size="large"
                            title={t("settings.about.repository")}
                            pressableProps={{onPress: openRepositoryPage}}
                        />

                        <Button
                            type="link"
                            size="large"
                            title={t("settings.about.privacyPolicy")}
                            pressableProps={{onPress: openPrivacyPolicyPage}}
                        />

                        <Button
                            type="link"
                            size="large"
                            title={t("settings.about.contact")}
                            pressableProps={{onPress: contactDeveloper}}
                        />

                        <Text className="text-center" size="small" color="muted">
                            Made with ❤️ by Signum Network
                        </Text>
                    </View>
                </Card>
                <ResetWalletDialog variant="accent"/>
            </View>
        </>
    );
};
