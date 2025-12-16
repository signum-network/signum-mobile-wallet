import { useState, type ReactNode } from "react";
import type { LinkProps } from "expo-router/build/link/Link";
import { Link } from "expo-router";
import { Pressable, PressableProps, Text, View } from "react-native";
import clsx from "clsx";
import { useAppTheme } from "@/hooks/useAppTheme";

export interface Props {
  type?: "primary" | "secondary" | "error" | "blackout" | "link";
  size?: "small" | "medium" | "large";
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
}: Props) => {
  const { tokens } = useAppTheme();
  const [isPressed, setIsPressed] = useState(false);

  const heightClass =
    size === "small" ? "h-12" : size === "large" ? "h-16" : "h-14";

  const classNames = clsx(
    "flex flex-row justify-center items-center py-1 ripple-[#333] ripple-bordered",
    heightClass,
    fullWidth && "w-full",
    wide && "!px-16",
    rounded ? "rounded-full" : "rounded-lg",
    extraClassNames
  );

  const textSize =
    size === "small" ? "text-sm" : size === "large" ? "text-xl" : "text-base";
  const lineHeight = size === "small" ? 16 : size === "large" ? 22 : 18;

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
    <>
      {icon && <View className={title ? "mr-4" : undefined}>{icon}</View>}
      {title && TextContent}
      {children}
    </>
  );

  const handlePressIn: PressableProps["onPressIn"] = (e) => {
    setIsPressed(true);
    pressableProps?.onPressIn?.(e);
  };

  const handlePressOut: PressableProps["onPressOut"] = (e) => {
    setIsPressed(false);
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
        opacity: disabled ? 0.7 : isPressed ? 0.7 : 1,
      }}
    >
      {Inner}
    </Pressable>
  );

  if (linkProps) {
    return (
      <Link {...linkProps} asChild>
        {pressable}
      </Link>
    );
  }

  return pressable;
};
