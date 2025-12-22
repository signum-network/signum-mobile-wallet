import {useMemo} from "react";
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
    const ipfsImage = useMemo(() => {
        if (isLoading) return null;
        try {
            if (avatarIpfsHash) {
                return `${PUBLIC_IPFS_GATEWAY}/${avatarIpfsHash}`;
            }
        } catch {
            // noop
        }
        return null;
    }, [isLoading, avatarIpfsHash]);

    return (
        <View
            className={clsx([
                "size-11 overflow-hidden rounded-lg",
                !ipfsImage && "pr-1",
                extraClassNames && extraClassNames,
            ])}
        >
            {ipfsImage ? (
                <Image
                    source={ipfsImage}
                    contentFit="cover"
                    style={{width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.05)"}}
                />
            ) : (
                <View className="relative">
                    <HashIconAvatarNativeSVG seed={tokenId}/>
                    <View className="absolute left-[3px] flex justify-center items-center w-full h-full text-white">
                        <Text size="large" className="font-bold let">{ticker.slice(0, 3).toUpperCase()}</Text>
                    </View>
                </View>
            )}
        </View>
    );
};
