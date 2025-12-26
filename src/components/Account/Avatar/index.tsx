import { useMemo } from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { src44 } from "@signumjs/standards";
import clsx from "clsx";
import HashIconNativeSVG from "@/components/Account/Avatar/HashIconNativeSVG";
import {toIpfsUrl} from "@/utils/toIpsUrl";

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
  const images = useMemo(() => {
    if (loading || !description) return null;
    try {
      const descriptor = src44.DescriptorData.parse(description, false);
      return {
          avatarUrl: toIpfsUrl(descriptor?.avatar?.ipfsCid) ?? null,
          backgroundUrl: toIpfsUrl(descriptor?.background?.ipfsCid) ?? null
      }
    } catch {
      return null;
    }
  }, [loading, description]);

  return (
    <View
      className={clsx([
        "size-11 overflow-hidden rounded-md relative",
        !images?.avatarUrl && "pr-1",
        extraClassNames && extraClassNames,
      ])}
    >
      {/* Background Image Layer */}
      {images?.backgroundUrl && (
        <Image
          source={images.backgroundUrl}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={200}
          recyclingKey={`${accountId}-bg`}
          style={{
            position: 'absolute',
            width: "100%",
            height: "100%",
            opacity: 0.3
          }}
        />
      )}

      {/* Avatar/Icon Layer */}
      {images?.avatarUrl ? (
        <Image
          source={images.avatarUrl}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={200}
          recyclingKey={accountId}
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <HashIconNativeSVG seed={accountId} />
      )}
    </View>
  );
};
