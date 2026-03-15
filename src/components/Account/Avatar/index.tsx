import { useMemo, useState } from "react";
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
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);

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

  // Reset loaded states when images change
  useMemo(() => {
    setAvatarLoaded(false);
    setBackgroundLoaded(false);
  }, [images?.avatarUrl, images?.backgroundUrl]);

  const showAvatar = images?.avatarUrl && avatarLoaded;
  const showBackground = images?.backgroundUrl && backgroundLoaded;

  return (
    <View
      className={clsx([
        "size-11 overflow-hidden rounded-md relative",
        !showAvatar && "pr-1",
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
          onLoad={() => setBackgroundLoaded(true)}
          onError={() => setBackgroundLoaded(false)}
          style={{
            position: 'absolute',
            width: "100%",
            height: "100%",
            opacity: showBackground ? 0.3 : 0
          }}
        />
      )}

      {/* Avatar/Icon Layer */}
      {images?.avatarUrl ? (
        <>
          {/* Show default avatar while loading */}
          {!avatarLoaded && <HashIconNativeSVG seed={accountId} />}

          <Image
            source={images.avatarUrl}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={200}
            recyclingKey={accountId}
            onLoad={() => setAvatarLoaded(true)}
            onError={() => setAvatarLoaded(false)}
            style={{
              width: "100%",
              height: "100%",
              opacity: avatarLoaded ? 1 : 0
            }}
          />
        </>
      ) : (
        <HashIconNativeSVG seed={accountId} />
      )}
    </View>
  );
};
