import type {Account, Transaction} from "@signumjs/core";
import {useMemo, useState} from "react";
import {Image} from "expo-image";
import {Card} from "@/components/Card";
import clsx from "clsx";
import {View} from "react-native";
import {Text} from "@/components/Text";
import {toIpfsUrl} from "@/utils/toIpsUrl";
import {useTranslation} from "react-i18next";
import {useNftMetaData} from "@/hooks/useNftMetaData";

type Props = {
    transaction?: Transaction;
    account?: Account
    label?: string
}

export function NftDescriptor({transaction, account, label}: Props) {

    const {t} = useTranslation();
    const [imageError, setImageError] = useState(false);
    const {nftMetaData, isLoading, error} = useNftMetaData({transaction, account});

    const ipfsImageUrl = useMemo(() => {
        if (isLoading) return null;
        if (error) return null;
        const foundMedia = nftMetaData?.media?.find(m => m.thumb)
        return foundMedia?.thumb ? toIpfsUrl(foundMedia.thumb) : null;
    }, [error, isLoading, nftMetaData]);

    if (error) {
        return <>
            <Card>
                <Text size="large" color="muted" className="font-bold">{t("nft.creation")} - {label}</Text>
                <View className="flex flex-row items-start justify-start gap-2">
                    <View className="flex flex-col items-center justify-center size-[64px] bg-red-100 rounded-md">
                        <Text size="extraSmall" color="muted">✕</Text>
                    </View>
                    <View className="flex flex-col items-start flex-1">
                        <Text size="small" color="muted">Failed to load NFT metadata</Text>
                    </View>
                </View>
            </Card>
        </>
    }


    return <>
        <Card>
            <Text size="large" color="muted"
                  className="font-bold">
                {t(account ? "nft.operation" : "nft.creation")}
                {label ? ` - ${label}` : ""}
            </Text>
            <View className="flex flex-row items-start justify-start gap-2">
                <View className={clsx(["size-[64px] overflow-hidden rounded-md"])}>
                    {ipfsImageUrl && !imageError ? (
                        <Image
                            source={ipfsImageUrl}
                            contentFit="cover"
                            cachePolicy="memory-disk"
                            transition={200}
                            recyclingKey={ipfsImageUrl}
                            style={{width: "100%", height: "100%"}}
                            onError={() => setImageError(true)}
                        />
                    ) : isLoading ? (
                        <View className="flex flex-col items-center justify-center size-[64px] bg-gray-200">
                            <Text size="extraSmall">Loading</Text>
                        </View>
                    ) : (
                        <View className="flex flex-col items-center justify-center size-[64px] bg-gray-300 rounded-md">
                            <Text size="small" color="muted">🖼️</Text>
                        </View>
                    )}
                </View>
                <View className="flex flex-col items-start flex-1">
                    <Text size="large" color="muted"
                          className="font-bold text-ellipsis whitespace-nowrap overflow-hidden">{nftMetaData?.name || "NFT"}</Text>
                    <Text size="small" color="muted">{nftMetaData?.description || "No description available"}</Text>
                </View>
            </View>
        </Card>
    </>
}
