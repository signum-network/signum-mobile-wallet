import { useMemo } from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { PUBLIC_IPFS_GATEWAY } from "@/types/constants";
import clsx from "clsx";
import DOMComponent from "@/components/DOM/HashIconAvatar";

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
      return null;
    }
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
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.05)",
          }}
        />
      ) : (
        <DOMComponent id={tokenId} />
      )}
    </View>
  );
};
