import { View } from "react-native";
import { Image } from "expo-image";
import { useAppTheme } from "@/hooks/useAppTheme";
import type { BackgroundLayerProps } from "./types";

export const BackgroundLayer: React.FC<BackgroundLayerProps> = ({
  backgroundUrl,
  isSelected = false,
  onLoad,
  onError,
  isLoaded = false,
  accountId,
}) => {
  const { tokens } = useAppTheme();
  const showBackground = backgroundUrl && isLoaded;

  return (
    <View className="absolute inset-0">
      {backgroundUrl ? (
        <>
          <Image
            source={backgroundUrl}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={200}
            recyclingKey={`${accountId}-bg`}
            onLoad={onLoad}
            onError={onError}
            style={{
              width: "100%",
              height: "100%",
              opacity: showBackground ? 1 : 0,
            }}
          />
          {/* Dark overlay for text readability */}
          {showBackground && (
            <View
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backgroundColor: isSelected
                  ? "rgba(0,0,0,0.4)"
                  : "rgba(0,0,0,0.5)",
              }}
            />
          )}
        </>
      ) : null}

      {/* Default background when no IPFS background or not loaded yet */}
      {!showBackground && (
        <View
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: isSelected ? tokens.primarySoft : tokens.surface,
          }}
        />
      )}
    </View>
  );
};
