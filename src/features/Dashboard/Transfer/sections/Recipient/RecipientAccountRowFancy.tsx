import React, {useMemo, useState} from "react";
import {Pressable, View} from "react-native";
import {Image} from "expo-image";
import {src44} from "@signumjs/standards";
import {Text} from "@/components/Text";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useNodeHostStore} from "@/hooks/useNodeHostStore";
import {useAppTheme} from "@/hooks/useAppTheme";
import {asRSAddress} from "@/utils/account/asRSAddress";
import {toIpfsUrl} from "@/utils/toIpsUrl";
import HashIconNativeSVG from "@/components/Account/Avatar/HashIconNativeSVG";
import {useQuery} from "@tanstack/react-query";
import {useLedgerService} from "@/hooks/useLedgerService";
import {
    PUBLIC_SIGNUM_AVERAGE_BLOCK_TIME_IN_MILLISECONDS,
} from "@/types/constants";
import {isAccountSrc40Nft} from "@/utils/account/isAccountSrc40Nft";
import {useNftMetaData} from "@/hooks/useNftMetaData";

type Props = {
    accountId: string;
    onSelect: (rs: string) => void;
    selectedAccountId?: string | null;
};

type StatusBadgeProps = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    backgroundColor: string;
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ icon, label, backgroundColor }) => (
    <View
        className="flex flex-row items-center gap-0.5 px-1.5 rounded opacity-80"
        style={{ backgroundColor }}
    >
        <Ionicons name={icon} size={8} color="white"/>
        <Text
            style={{
                fontSize: 8,
                color: "white",
                fontWeight: "600",
            }}
        >
            {label}
        </Text>
    </View>
);

export const RecipientAccountRowFancy: React.FC<Props> = ({
                                                              accountId,
                                                              onSelect,
                                                              selectedAccountId,
                                                          }) => {
    const {currentNetwork} = useNodeHostStore();
    const {tokens} = useAppTheme();
    const {ledgerService} = useLedgerService()
    const [avatarLoaded, setAvatarLoaded] = useState(false);
    const [backgroundLoaded, setBackgroundLoaded] = useState(false);
    const [avatarLoadError, setAvatarLoadError] = useState(false);
    const [backgroundLoadError, setBackgroundLoadError] = useState(false);

    const {data: account, isLoading} = useQuery({
        queryKey: ["fetchAccountDescription", accountId, currentNetwork],
        queryFn: () => {
            return ledgerService?.account.fetchAccount(accountId)
        },
        enabled: Boolean(ledgerService),
        staleTime: PUBLIC_SIGNUM_AVERAGE_BLOCK_TIME_IN_MILLISECONDS * 4
    },)

    let accountData = useMemo(() => {
        if (isLoading || !account) return null;

        const basicInfo = {
            accountId: account.account,
            accountRS: account.name ? account.accountRS : account.account,
            name: account.name ?? account.accountRS,
            description: account.description,
            isContract: account.isAT,
            isSecured: account.isSecured,
            avatarUrl: null,
            backgroundUrl: null,
            isNft: isAccountSrc40Nft(account),
        }

        try {
            const descriptor = src44.DescriptorData.parse(account.description, false);
            return {
                ...basicInfo,
                name: account.name,
                description: account.description,
                avatarUrl: toIpfsUrl(descriptor?.avatar?.ipfsCid) ?? null,
                backgroundUrl: toIpfsUrl(descriptor?.background?.ipfsCid) ?? null,
            }
        } catch {
        }

        return basicInfo;
    }, [account])

    const {nftMetaData} = useNftMetaData({account});

    // Reset loaded states when images change
    useMemo(() => {
        setAvatarLoaded(false);
        setBackgroundLoaded(false);
        setAvatarLoadError(false);
        setBackgroundLoadError(false);
    }, [accountData?.avatarUrl, accountData?.backgroundUrl]);


    accountData  = useMemo(() => {
        if(nftMetaData && accountData){
            const foundMedia = nftMetaData?.media?.find(m => m.thumb)
            return {
                ...accountData,
                name: nftMetaData.name,
                avatarUrl: foundMedia?.thumb ? toIpfsUrl(foundMedia.thumb) : accountData.avatarUrl,
            }
        }
        return accountData;
    }, [nftMetaData, accountData]);

    const showBackground = accountData?.backgroundUrl && backgroundLoaded && !backgroundLoadError;
    const isSelected = selectedAccountId && selectedAccountId === accountId;
    return (
        <Pressable
            onPress={() => onSelect(asRSAddress(accountId)!)}
            className="rounded-xl overflow-hidden active:opacity-90 my-1"
            style={{
                height: 90,
                borderWidth: 2,
                borderColor: isSelected ? tokens.success : "transparent",
            }}
        >
            {/* Background Layer */}
            <View className="absolute inset-0">
                {accountData?.backgroundUrl && !backgroundLoadError ? (
                    <>
                        <Image
                            source={accountData.backgroundUrl}
                            contentFit="cover"
                            cachePolicy="memory-disk"
                            transition={200}
                            recyclingKey={`${accountId}-bg`}
                            onLoad={() => setBackgroundLoaded(true)}
                            onError={() => {
                                setBackgroundLoaded(false);
                                setBackgroundLoadError(true);
                            }}
                            style={{
                                width: "100%",
                                height: "100%",
                                opacity: showBackground ? 1 : 0,
                            }}
                        />
                        {/* Dark overlay for text readability */}
                        {showBackground && (
                            <View
                                style={{
                                    position: "absolute",
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor: isSelected
                                        ? "rgba(0,0,0,0.4)"
                                        : "rgba(0,0,0,0.5)",
                                }}
                            />
                        )}
                    </>
                ) : null}

                {/* Default background when no IPFS background or not loaded yet */}
                {!showBackground && (
                    <View
                        style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: isSelected
                                ? tokens.surfaceElevated
                                : tokens.surface,
                        }}
                    />
                )}
            </View>

            {/* Content Layer */}
            <View className="relative w-full h-full px-4 flex flex-row items-center justify-between">
                {/* Left: Avatar and Info */}
                <View className="flex flex-row gap-3 items-center flex-1">
                    {/* Avatar */}
                    <View
                        className="size-16 rounded-full overflow-hidden border-2 border-white/30 shadow-lg bg-white/10">
                        {accountData?.avatarUrl && !avatarLoadError ? (
                            <>
                                {/* Show default avatar while loading */}
                                {!avatarLoaded && (
                                    <View className="w-full h-full flex items-center justify-center">
                                        <HashIconNativeSVG seed={accountId}/>
                                    </View>
                                )}

                                <Image
                                    source={accountData.avatarUrl}
                                    contentFit="cover"
                                    cachePolicy="memory-disk"
                                    transition={200}
                                    recyclingKey={accountId + "-avatar"}
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
                    <View className="flex flex-col flex-1 gap-0.5">
                        {showBackground ? (
                            <View className="bg-black/30 rounded-lg px-2 py-1 self-start">
                                <Text
                                    color="white"
                                    className="font-medium"
                                    style={{
                                        textShadowColor: "rgba(0, 0, 0, 0.75)",
                                        textShadowOffset: {width: 0, height: 1},
                                        textShadowRadius: 3,
                                    }}
                                >
                                    {accountData?.name ?? ""}
                                </Text>
                            </View>
                        ) : (
                            <Text size="medium" color="content" className="font-medium">
                                {accountData?.name ?? ""}
                            </Text>
                        )}

                        {/* Address and Status Badges Row */}
                        <View className="flex flex-row items-center justify-between gap-1.5">
                            <Text
                                size="small"
                                color={showBackground ? "white" : "muted"}
                                style={
                                    showBackground
                                        ? {
                                            textShadowColor: "rgba(0, 0, 0, 0.75)",
                                            textShadowOffset: {width: 0, height: 1},
                                            textShadowRadius: 3,
                                        }
                                        : {}
                                }
                            >
                                {accountData?.accountRS ?? ""}
                            </Text>

                            {/* Status Badges */}
                            {accountData && (accountData.isNft || accountData.isContract || !accountData.isSecured) && (
                                <View className="flex flex-row gap-1 flex-wrap">
                                    {accountData.isNft && (
                                        <StatusBadge
                                            icon="image"
                                            label="NFT"
                                            backgroundColor={
                                                showBackground
                                                    ? "rgba(139, 92, 246, 0.9)"
                                                    : "#8B5CF6"
                                            }
                                        />
                                    )}

                                    {accountData.isContract && !accountData.isNft && (
                                        <StatusBadge
                                            icon="code-slash"
                                            label="Contract"
                                            backgroundColor={
                                                showBackground
                                                    ? "rgba(59, 130, 246, 0.9)"
                                                    : tokens.primary ?? "#3B82F6"
                                            }
                                        />
                                    )}

                                    {!accountData.isSecured && (
                                        <StatusBadge
                                            icon="shield-outline"
                                            label="Unsecured"
                                            backgroundColor={
                                                showBackground
                                                    ? "rgba(239, 68, 68, 0.9)"
                                                    : "#EF4444"
                                            }
                                        />
                                    )}
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        </Pressable>
    );
};
