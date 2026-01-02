import {useState, useMemo} from "react";
import {View, Pressable, ActivityIndicator} from "react-native";
import {useTranslation} from "react-i18next";
import {useAppTheme} from "@/hooks/useAppTheme";
import {AccountAvatar} from "./AccountAvatar";
import {BackgroundLayer} from "./BackgroundLayer";
import {StatusIndicators} from "./StatusIndicators";
import {useAccountCardData} from "./useAccountCardData";
import type {GenericAccountCardProps} from "./types";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Text} from "@/components/Text";

type ImageLoadState = "loading" | "loaded" | "error";

export const GenericAccountCard: React.FC<GenericAccountCardProps> = ({
                                                                          account,
                                                                          watchOnly = false,
                                                                          height = 100,
                                                                          statusIndicators: providedStatusIndicators,
                                                                          showStatusIndicators = true,
                                                                          images: providedImages,
                                                                          children,
                                                                          onPress,
                                                                          isSelected = false,
                                                                          className = "",
                                                                      }) => {
    const {t} = useTranslation();
    const {tokens, iconColor} = useAppTheme();
    const [avatarLoadState, setAvatarLoadState] = useState<ImageLoadState>("loading");
    const [backgroundLoadState, setBackgroundLoadState] = useState<ImageLoadState>("loading");

    // Auto-generate images and status indicators
    const {images, statusIndicators} = useAccountCardData({
        account,
        watchOnly,
        providedImages,
        providedStatusIndicators,
    });

    // Reset loaded states when images change
    useMemo(() => {
        setAvatarLoadState(images?.avatarUrl ? "loading" : "loaded");
        setBackgroundLoadState(images?.backgroundUrl ? "loading" : "loaded");
    }, [images?.avatarUrl, images?.backgroundUrl]);

    // Combined IPFS loading state
    const hasAvatarIpfs = !!images?.avatarUrl;
    const hasBackgroundIpfs = !!images?.backgroundUrl;
    const hasAnyIpfs = hasAvatarIpfs || hasBackgroundIpfs;
    const isLoadingIpfs = (hasAvatarIpfs && avatarLoadState === "loading") ||
                          (hasBackgroundIpfs && backgroundLoadState === "loading");
    const hasIpfsError = (hasAvatarIpfs && avatarLoadState === "error") ||
                         (hasBackgroundIpfs && backgroundLoadState === "error");

    const showBackground = !!(images?.backgroundUrl && backgroundLoadState === "loaded");

    const content = (
        <View
            className={`rounded-xl overflow-hidden w-full ${className}`}
            style={{
                height,
                borderWidth: isSelected ? 3 : 0,
                borderColor: isSelected ? tokens.success : "transparent",
            }}
        >
            {/* Background Layer */}
            <BackgroundLayer
                backgroundUrl={images?.backgroundUrl ?? null}
                isSelected={isSelected}
                onLoad={() => setBackgroundLoadState("loaded")}
                onError={() => setBackgroundLoadState("error")}
                isLoaded={backgroundLoadState === "loaded"}
                accountId={account.account}
            />

            {/* Content Layer */}
            <View className="relative w-full h-full px-4 flex flex-row items-center">
                <View className="flex flex-row gap-3 items-center flex-1">
                    {/* Avatar */}
                    <AccountAvatar
                        accountId={account.account}
                        avatarUrl={images?.avatarUrl ?? null}
                        size={64}
                        onLoad={() => setAvatarLoadState("loaded")}
                        onError={() => setAvatarLoadState("error")}
                        isLoaded={avatarLoadState === "loaded"}
                    />

                    {/* Custom Content via Render Props */}
                    <View className="flex flex-col flex-1 gap-0.5">
                        {children?.({showBackground, account, statusIndicators})}

                        {/* Status Indicators */}
                    </View>
                    {showStatusIndicators && statusIndicators?.length > 0 && (
                        <View className="absolute top-0 right-0 flex flex-row gap-1 items-center">
                            <StatusIndicators
                                indicators={statusIndicators}
                                showBackground={showBackground}
                            />
                        </View>
                    )}
                </View>

                {/* IPFS Loading/Error Indicator at Bottom */}
                {hasAnyIpfs && (isLoadingIpfs || hasIpfsError) && (
                    <View
                        className="absolute bottom-1 left-2 flex-row items-center gap-1 px-2 py-0.5 rounded-full"
                        style={{
                            backgroundColor: showBackground
                                ? 'rgba(0, 0, 0, 0.5)'
                                : 'rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        {isLoadingIpfs && (
                            <>
                                <ActivityIndicator
                                    size="small"
                                    color={showBackground ? "white" : tokens.primary}
                                />
                                <Text
                                    size="extraSmall"
                                    color={showBackground ? "white" : "muted"}
                                    style={{
                                        fontSize: 10,
                                        ...(showBackground && {
                                            textShadowColor: "rgba(0, 0, 0, 0.75)",
                                            textShadowOffset: { width: 0, height: 1 },
                                            textShadowRadius: 2,
                                        })
                                    }}
                                >
                                    {t("ipfs.loading")}
                                </Text>
                            </>
                        )}
                        {hasIpfsError && (
                            <>
                                <Ionicons
                                    name="warning"
                                    size={14}
                                    color={showBackground ? "white" : iconColor.red}
                                />
                                <Text
                                    size="extraSmall"
                                    color={showBackground ? "white" : "error"}
                                    style={{
                                        fontSize: 10,
                                        ...(showBackground && {
                                            textShadowColor: "rgba(0, 0, 0, 0.75)",
                                            textShadowOffset: { width: 0, height: 1 },
                                            textShadowRadius: 2,
                                        })
                                    }}
                                >
                                    {t("ipfs.error")}
                                </Text>
                            </>
                        )}
                    </View>
                )}
            </View>
        </View>
    );

    if (onPress) {
        return (
            <Pressable onPress={onPress} className="active:opacity-90">
                {content}
            </Pressable>
        );
    }

    return content;
};
