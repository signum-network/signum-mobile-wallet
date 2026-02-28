import {useEffect, useMemo, useState} from "react";
import {View} from "react-native";
import {Image} from "expo-image";
import clsx from "clsx";
import {PUBLIC_IPFS_GATEWAY} from "@/types/constants";
import {useTokenTransactionalData} from "@/hooks/useTokenTransactionalData";
import {Text} from "@/components/Text";
import HashIconAvatarNativeSVG from "@/components/Account/Avatar/HashIconNativeSVG";
import {useTokenMetadata} from "@/hooks/useTokenMetadata";

interface Props {
    tokenId: string;
    extraClassNames?: string;
}

export const TokenAvatar = ({
                                tokenId,
                                extraClassNames,
                            }: Props) => {
    const {ticker} = useTokenMetadata(tokenId)
    const {avatarIpfsHash, isLoading} = useTokenTransactionalData(tokenId);
    const [avatarLoaded, setAvatarLoaded] = useState(false);


    const ipfsImage = useMemo(() => {
        if (isLoading) return null;
        if (avatarIpfsHash) {
            return `${PUBLIC_IPFS_GATEWAY}/${avatarIpfsHash}`;
        }
        return null;
    }, [isLoading, avatarIpfsHash]);

    useEffect(() => {
        setAvatarLoaded(false);
    }, [avatarIpfsHash]);

    return (
        <View
            className={clsx([
                "size-11 overflow-hidden rounded",
                !ipfsImage && "pr-1",
                extraClassNames && extraClassNames,
            ])}
        >
            {ipfsImage && (
                <Image
                    source={ipfsImage}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    transition={200}
                    recyclingKey={`${tokenId}-token-avatar`}
                    style={{
                        width: "100%",
                        height: "100%",
                        opacity: avatarLoaded ? 1 : 0,
                    }}
                    onLoad={() => setAvatarLoaded(true)}
                    onError={() => setAvatarLoaded(false)}
                />
            )}
            {!(ipfsImage && avatarLoaded) && (
                <DefaultTokenIcon tokenId={tokenId} ticker={ticker}/>
            )}
        </View>
    );
};

const DefaultTokenIcon = ({tokenId, ticker}: Props & { ticker: string }) => {
    return (
        <View className="relative">
            <HashIconAvatarNativeSVG seed={tokenId}/>
            <View className="absolute left-[3px] flex justify-center items-center w-full h-full text-white">
                <Text size="medium" className="font-bold let">{ticker.slice(0, 3).toUpperCase()}</Text>
            </View>
        </View>
    )
}
