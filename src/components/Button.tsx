import {useState, useRef, useEffect, type ReactNode} from "react";
import type {LinkProps} from "expo-router/build/link/Link";
import {Link} from "expo-router";
import {Pressable, PressableProps, Text, View} from "react-native";
import Animated, {useSharedValue, useAnimatedStyle, withTiming, interpolate} from "react-native-reanimated";
import clsx from "clsx";
import {useAppTheme} from "@/hooks/useAppTheme";

export interface ButtonProps {
    type?: "primary" | "secondary" | "error" | "blackout" | "link";
    size?: "extraSmall" | "small" | "medium" | "large";
    linkProps?: LinkProps;
    pressableProps?: PressableProps;
    title?: string;
    icon?: ReactNode;
    fullWidth?: boolean;
    wide?: boolean;
    rounded?: boolean;
    children?: ReactNode;
    disabled?: boolean;
    extraClassNames?: string;
    titleClassName?: string;
}

export const Button = ({
                           type,
                           size = "medium",
                           linkProps,
                           pressableProps,
                           title,
                           icon,
                           fullWidth,
                           wide,
                           rounded = true,
                           children,
                           disabled = false,
                           extraClassNames,
                           titleClassName,
                       }: ButtonProps) => {
    const {tokens} = useAppTheme();
    const [isPressed, setIsPressed] = useState(false);
    const progressAnim = useSharedValue(0);
    const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

    const hasLongPress = !!pressableProps?.delayLongPress;
    const longPressDelay = pressableProps?.delayLongPress || 0;

    const heightClass =
        size === "extraSmall" ? "h-8" : size ===  "small" ? "h-12" : size === "large" ? "h-16" : "h-14";

    const paddingClass =
        size === "extraSmall" ? "px-2" : size === "small" ? "px-2" : "px-3";

    const classNames = clsx(
        "flex flex-row justify-center items-center py-1 ripple-[#333] ripple-bordered",
        heightClass,
        fullWidth && "w-full",
        wide && "!px-16",
        rounded ? "rounded-full" : "rounded-lg",
        extraClassNames
    );

    const textSize =
        size === "extraSmall" ? "text-sm" : size === "small" ? "text-sm" : size === "large" ? "text-xl" : "text-base";
    const lineHeight = size === "extraSmall" ? 14 : size === "small" ? 16 : size === "large" ? 22 : 18;

    let backgroundColor: string | undefined;
    let textColor: string | undefined;

    if (disabled) {
        backgroundColor = tokens.surfaceElevated;
        textColor = tokens.textMuted;
    } else {
        switch (type) {
            case "primary":
                backgroundColor = tokens.primary;
                textColor = "#FFFFFF";
                break;
            case "secondary":
                backgroundColor = tokens.surfaceElevated;
                textColor = tokens.text;
                break;
            case "error":
                backgroundColor = tokens.error;
                textColor = "#FFFFFF";
                break;
            case "blackout":
                backgroundColor = tokens.text;
                textColor = tokens.background;
                break;
            case "link":
                backgroundColor = "transparent";
                textColor = tokens.primary;
                break;
            default:
                backgroundColor = "transparent";
                textColor = tokens.text;
                break;
        }
    }

    const animatedProgressStyle = useAnimatedStyle(() => {
        const scaleX = interpolate(
            progressAnim.value,
            [0, 100],
            [0, 1]
        );

        return {
            transform: [{scaleX}, {translateX: 0}],
        };
    });

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (longPressTimerRef.current) {
                clearTimeout(longPressTimerRef.current);
            }
        };
    }, []);

    const textClassNames = clsx(
        disabled && "font-bold",
        textSize,
        titleClassName
    );

    const TextContent = (
        <Text
            className={textClassNames}
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
                flexShrink: 1,
                flexWrap: "wrap",
                textAlign: "center",
                lineHeight,
                color: textColor,
            }}
        >
            {title}
        </Text>
    );

    const Inner = (
        <View className="flex flex-row items-center justify-center" style={{flexShrink: 0}}>
            {icon && <View className={title ? "mr-2" : undefined}>{icon}</View>}
            {title && TextContent}
            {children}
        </View>
    );

    const handlePressIn: PressableProps["onPressIn"] = (e) => {
        setIsPressed(true);

        if (hasLongPress) {
            // Animate progress from 0 to 100 over the long press duration
            progressAnim.value = 0;
            progressAnim.value = withTiming(100, {
                duration: longPressDelay,
            });
        }

        pressableProps?.onPressIn?.(e);
    };

    const handlePressOut: PressableProps["onPressOut"] = (e) => {
        setIsPressed(false);

        if (hasLongPress) {
            // Reset progress animation
            progressAnim.value = 0;
            if (longPressTimerRef.current) {
                clearTimeout(longPressTimerRef.current);
                longPressTimerRef.current = null;
            }
        }

        pressableProps?.onPressOut?.(e);
    };




    const pressable = (
            <Pressable
                disabled={disabled}
                className={classNames}
                {...pressableProps}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={{
                    backgroundColor,
                    opacity: disabled ? 0.7 : isPressed && !hasLongPress ? 0.7 : 1,
                    overflow: "hidden",
                }}
            >
                {hasLongPress &&
                    <Animated.View
                        style={[
                            {
                                position: "absolute",
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: "100%",
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                                borderRadius: rounded ? 999 : 8,
                                zIndex: 1,
                            },
                            animatedProgressStyle,
                        ]}
                    />}
                <View className={paddingClass} style={{zIndex: 2}}>{Inner}</View>
            </Pressable>
        )
    ;

    if (linkProps) {
        return (
            <Link {...linkProps} asChild>
                {pressable}
            </Link>
        );
    }

    return pressable;
};
