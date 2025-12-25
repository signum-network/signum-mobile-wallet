import type {Account, Transaction} from "@signumjs/core";
import {useQuery} from "@tanstack/react-query";
import {useMemo, useState} from "react";
import {Image} from "expo-image";


import {object, string, number, array} from 'yup';
import {PUBLIC_IPFS_GATEWAY} from "@/types/constants";
import {Card} from "@/components/Card";
import clsx from "clsx";
import {View} from "react-native";
import {Text} from "@/components/Text";
import {toIpfsUrl} from "@/utils/toIpsUrl";
import {useTranslation} from "react-i18next";


const ipfsUrl = (cid: string) => `${PUBLIC_IPFS_GATEWAY}/${cid}`;

const mediaItemSchema = object().shape({
    social: string(),
    thumb: string(),
});

const nftDescriptorSchema = object().shape({
    version: number().required(),
    name: string().required(),
    title: string(),
    description: string(),
    collectionId: string(),
    media: array().of(mediaItemSchema),
    attributes: array()
});

type Props = {
    transaction?: Transaction;
    account?: Account
    label?: string
}

export function NftDescriptor({transaction, account, label}: Props) {

    const {t} = useTranslation();
    const [imageError, setImageError] = useState(false);

    const descriptorCid = useMemo(() => {
        try {
            const {descriptor} = JSON.parse(transaction?.attachment?.description ?? account?.description ?? "")
            return descriptor as string ?? null;
        } catch {
            return null
        }
    }, [transaction?.attachment, account?.description]);

    const {data: nftMetaData, isLoading, error} = useQuery({
        queryKey: ["fetchNftDescriptor", descriptorCid],
        queryFn: async () => {
            const url = toIpfsUrl(descriptorCid) ?? "";
            if (!url) return;

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            try {
                const result = await fetch(url, {
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'Mozilla/5.0 (compatible; SignumWallet/1.0)',
                    },
                    signal: controller.signal
                })
                clearTimeout(timeoutId);

                if (!result.ok) {
                    throw new Error(`Failed to fetch NFT metadata: ${result.status}`);
                }

                const descriptor = await result.json()
                return nftDescriptorSchema.validate(descriptor)
            } catch (err) {
                clearTimeout(timeoutId);
                throw err;
            }
        },
        enabled: !!descriptorCid,
        retry: 2,
        retryDelay: 1000
    })

    const ipfsImageUrl = useMemo(() => {
        if (isLoading) return null;
        if (error) return null;
        const foundMedia = nftMetaData?.media?.find(m => m.thumb)
        return foundMedia?.thumb ? ipfsUrl(foundMedia.thumb) : null;
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
                    <Text size="large" color="muted" className="font-bold">{nftMetaData?.name || "NFT"}</Text>
                    <Text size="small" color="muted">{nftMetaData?.description || "No description available"}</Text>
                </View>
            </View>
        </Card>
    </>
}
