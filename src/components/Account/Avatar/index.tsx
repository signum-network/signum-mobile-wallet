import { useMemo } from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { src44 } from "@signumjs/standards";
import { PUBLIC_IPFS_GATEWAY } from "@/types/constants";
import clsx from "clsx";
import DOMComponent from "./HashIconAvatar";

interface Props {
  loading: boolean;
  accountId: string;
  description: string;
  extraClassNames?: string;
}

export const AccountAvatar = ({
  loading,
  accountId,
  description,
  extraClassNames,
}: Props) => {
  const ipfsImage = useMemo(() => {
    if (loading) return null;

    try {
      const descriptor = src44.DescriptorData.parse(description, false);

      if (descriptor.avatar) {
        return `${PUBLIC_IPFS_GATEWAY}/${descriptor.avatar.ipfsCid}`;
      }
    } catch {
      return null;
    }
  }, [loading, description]);

  return (
    <View
      className={clsx([
        "size-11 overflow-hidden rounded-md",
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
        <DOMComponent accountId={accountId} />
      )}
    </View>
  );
};
