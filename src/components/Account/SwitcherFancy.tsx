import {View, Pressable} from "react-native";
import {router} from "expo-router";
import {useTranslation} from "react-i18next";
import {Image} from "expo-image";
import {useMemo, useState} from "react";
import {src44} from "@signumjs/standards";
import {useAppTheme} from "@/hooks/useAppTheme";
import {useWalletAccount} from "@/hooks/useWalletAccount";
import {useAccountStore} from "@/hooks/useAccountStore";
import {Text} from "@/components/Text";
import {asRSAddress} from "@/utils/account/asRSAddress";
import {NoAccountsFoundCard} from "./NoAccountsFoundCard";
import {toIpfsUrl} from "@/utils/toIpsUrl";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import HashIconNativeSVG from "@/components/Account/Avatar/HashIconNativeSVG";

interface Props {
    href: "/dashboard/settings/account" | "/dashboard/account";
}

export const AccountSwitcherFancy = ({href}: Props) => {
    const {t} = useTranslation();
    const {tokens, iconColor} = useAppTheme();
    const {
        accountId,
        isWatchOnly,
        walletName,
        accountData: {loading, description},
    } = useWalletAccount();
    const {accountPublicKeys} = useAccountStore();

    // Track image loading states
    const [avatarLoaded, setAvatarLoaded] = useState(false);
    const [avatarLoadError, setAvatarLoadError] = useState(false);
    const [backgroundLoadError, setBackgroundLoadError] = useState(false);

    const images = useMemo(() => {
        if (loading || !description) return null;
        try {
            const descriptor = src44.DescriptorData.parse(description, false);
            // Reset error and loading states when URLs change
            setAvatarLoaded(false);
            setAvatarLoadError(false);
            setBackgroundLoadError(false);
            return {
                avatarUrl: toIpfsUrl(descriptor?.avatar?.ipfsCid) ?? null,
                backgroundUrl: toIpfsUrl(descriptor?.background?.ipfsCid) ?? null,
            };
        } catch {
            return null;
        }
    }, [loading, description]);

    const goToAccountSettings = () => {
        href === "/dashboard/account" ? router.replace(href) : router.push(href);
    };

    if (!accountPublicKeys.length) return <NoAccountsFoundCard/>;

    return (
        <Pressable
            onPress={goToAccountSettings}
            className="w-full rounded-xl overflow-hidden active:opacity-90"
            style={{
                height: 140,
            }}
        >
            {/* Background Layer */}
            <View className="absolute inset-0">
                {images?.backgroundUrl && !backgroundLoadError ? (
                    <>
                        <Image
                            source={images.backgroundUrl}
                            contentFit="cover"
                            cachePolicy="memory-disk"
                            transition={200}
                            onError={() => setBackgroundLoadError(true)}
                            style={{width: "100%", height: "100%"}}
                        />
                        {/* Dark overlay for text readability */}
                        <View
                        className="!rounded-xl overflow-hidden"
                            style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0,0,0,0.5)",
                                borderWidth: 2,
                                borderColor: tokens.success
                            }}
                        />
                    </>
                ) : (
                    <View
                        className="!rounded-xl overflow-hidden"
                        style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: tokens.surfaceElevated,
                            borderWidth: 2,
                            borderColor: tokens.success
                        }}
                    />
                )}
            </View>

            {/* Content Layer */}
            <View className="relative w-full h-full p-4 flex flex-row items-center justify-between">
                {/* Left: Avatar and Info */}
                <View className="flex flex-row gap-4 items-center flex-1">
                    {/* Large Avatar */}
                    <View
                        className="size-24 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl bg-white/10">
                        {images?.avatarUrl && !avatarLoadError ? (
                            <>
                                {/* Show HashIcon while loading */}
                                {!avatarLoaded && (
                                    <View className="w-full h-full flex items-center justify-center">
                                        <HashIconNativeSVG seed={accountId}/>
                                    </View>
                                )}
                                <Image
                                    source={images.avatarUrl}
                                    contentFit="cover"
                                    cachePolicy="memory-disk"
                                    transition={200}
                                    recyclingKey={accountId}
                                    onLoad={() => setAvatarLoaded(true)}
                                    onError={() => {
                                        setAvatarLoaded(false);
                                        setAvatarLoadError(true);
                                    }}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        opacity: avatarLoaded ? 1 : 0,
                                        position: avatarLoaded ? "relative" : "absolute",
                                    }}
                                />
                            </>
                        ) : (
                            <View className="w-full h-full flex items-center justify-center">
                                <HashIconNativeSVG seed={accountId}/>
                            </View>
                        )}
                    </View>

                    {/* Account Info */}
                    <View className="flex flex-col flex-1 gap-1">
                        {images?.backgroundUrl && !backgroundLoadError ? (
                            <View className="bg-black/30 rounded-lg px-2 py-1 self-start">
                                <Text
                                    color="white"
                                    size="large"
                                    className="font-bold"
                                    style={{
                                        textShadowColor: 'rgba(0, 0, 0, 0.75)',
                                        textShadowOffset: {width: 0, height: 1},
                                        textShadowRadius: 3,
                                    }}
                                >
                                    {walletName}
                                </Text>
                            </View>
                        ) : (
                            <Text
                                color="content"
                                size="large"
                                className="font-bold"
                            >
                                {walletName}
                            </Text>
                        )}

                        <Text
                            color={images?.backgroundUrl && !backgroundLoadError ? "white" : "muted"}
                            size="small"
                            style={images?.backgroundUrl && !backgroundLoadError ? {
                                textShadowColor: 'rgba(0, 0, 0, 0.75)',
                                textShadowOffset: {width: 0, height: 1},
                                textShadowRadius: 3,
                            } : {opacity: 0.8}}
                        >
                            {asRSAddress(accountId)}
                        </Text>

                        {/* Account Type Badge */}
                        <View className="flex flex-row items-center gap-1 mt-1">
                            <Ionicons
                                name={isWatchOnly ? "eye-outline" : "shield-checkmark-outline"}
                                size={12}
                                color={images?.backgroundUrl && !backgroundLoadError ? "white" : iconColor.muted}
                            />
                            <Text color={images?.backgroundUrl && !backgroundLoadError ? "white" : "muted"} size="extraSmall" className="font-medium">
                                {isWatchOnly ? t("watchOnly") : t("fullAccount")}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Right: Switch Icon */}
                <View className="bg-white/20 rounded-full p-3">
                    <FontAwesome6 name="right-left" size={20} color={images?.backgroundUrl && !backgroundLoadError ? "white" : tokens.success}/>
                </View>
            </View>
        </Pressable>
    );
};
