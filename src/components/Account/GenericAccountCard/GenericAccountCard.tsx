import {useState, useMemo} from "react";
import {View, Pressable} from "react-native";
import {useAppTheme} from "@/hooks/useAppTheme";
import {AccountAvatar} from "./AccountAvatar";
import {BackgroundLayer} from "./BackgroundLayer";
import {StatusIndicators} from "./StatusIndicators";
import {useAccountCardData} from "./useAccountCardData";
import type {GenericAccountCardProps} from "./types";

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
    const {tokens} = useAppTheme();
    const [avatarLoaded, setAvatarLoaded] = useState(false);
    const [backgroundLoaded, setBackgroundLoaded] = useState(false);

    // Auto-generate images and status indicators
    const {images, statusIndicators} = useAccountCardData({
        account,
        watchOnly,
        providedImages,
        providedStatusIndicators,
    });

    // Reset loaded states when images change
    useMemo(() => {
        setAvatarLoaded(false);
        setBackgroundLoaded(false);
    }, [images?.avatarUrl, images?.backgroundUrl]);

    const showBackground = !!(images?.backgroundUrl && backgroundLoaded);

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
                onLoad={() => setBackgroundLoaded(true)}
                onError={() => setBackgroundLoaded(false)}
                isLoaded={backgroundLoaded}
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
                        onLoad={() => setAvatarLoaded(true)}
                        onError={() => setAvatarLoaded(false)}
                        isLoaded={avatarLoaded}
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
