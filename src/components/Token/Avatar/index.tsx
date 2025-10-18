import { useMemo } from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import clsx from "clsx";
import { PUBLIC_IPFS_GATEWAY } from "@/types/constants";

import HashIconAvatarNativeSVG from "@/components/Account/Avatar/HashIconNativeSVG";

interface Props {
  loading: boolean;
  tokenId: string;
  avatarIpfsHash?: string;
  extraClassNames?: string;
}

export const TokenAvatar = ({
  loading,
  tokenId,
  avatarIpfsHash,
  extraClassNames,
}: Props) => {
  const ipfsImage = useMemo(() => {
    if (loading) return null;
    try {
      if (avatarIpfsHash) {
        return `${PUBLIC_IPFS_GATEWAY}/${avatarIpfsHash}`;
      }
    } catch {
      // noop
    }
    return null;
  }, [loading, avatarIpfsHash]);

  return (
    <View
      className={clsx([
        "size-10 overflow-hidden rounded-lg",
        !ipfsImage && "pr-1",
        extraClassNames && extraClassNames,
      ])}
    >
      {ipfsImage ? (
        <Image
          source={ipfsImage}
          contentFit="cover"
          style={{ width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.05)" }}
        />
      ) : (
        <HashIconAvatarNativeSVG seed={tokenId} />
      )}
    </View>
  );
};
