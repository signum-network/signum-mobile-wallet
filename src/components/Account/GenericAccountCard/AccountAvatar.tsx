import { View } from "react-native";
import { Image } from "expo-image";
import HashIconNativeSVG from "@/components/Account/Avatar/HashIconNativeSVG";
import type { AccountAvatarProps } from "./types";

export const AccountAvatar: React.FC<AccountAvatarProps> = ({
  accountId,
  avatarUrl,
  size = 64,
  onLoad,
  onError,
  isLoaded = false,
}) => {
  return (
    <View
      className="rounded-full overflow-hidden border-2 border-white/30 shadow-lg bg-white/10"
      style={{ width: size, height: size }}
    >
      {avatarUrl ? (
        <>
          {/* Show default avatar while loading */}
          {!isLoaded && (
            <View className="w-full h-full flex items-center justify-center">
              <HashIconNativeSVG seed={accountId} />
            </View>
          )}

          <Image
            source={avatarUrl}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={200}
            recyclingKey={`${accountId}-avatar`}
            onLoad={onLoad}
            onError={onError}
            style={{
              width: "100%",
              height: "100%",
              opacity: isLoaded ? 1 : 0,
              position: isLoaded ? "relative" : "absolute",
            }}
          />
        </>
      ) : (
        <View className="w-full h-full flex items-center justify-center">
          <HashIconNativeSVG seed={accountId} />
        </View>
      )}
    </View>
  );
};
