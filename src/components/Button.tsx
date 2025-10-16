import type { ReactNode } from "react";
import type { LinkProps } from "expo-router/build/link/Link";
import { Link } from "expo-router";
import { Pressable, PressableProps, Text, View } from "react-native";
import { useColorScheme } from "nativewind"; // <—
import clsx from "clsx";

export interface Props {
  type?: "primary" | "secondary" | "error" | "blackout";
  size?: "small" | "medium" | "large";
  linkProps?: LinkProps;
  pressableProps?: PressableProps;
  title?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
  wide?: boolean;
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
  children,
  disabled = false,
  extraClassNames,
  titleClassName,
}: Props) => {
  const { colorScheme } = useColorScheme(); // "light" | "dark" | "system"

  const heightClass =
    size === "small" ? "h-12" : size === "large" ? "h-16" : "h-14";


  const bgClass =
    type === "primary"
      ? "bg-signum dark:bg-signum-dark"
      : type === "secondary"
      ? "bg-gray-500 dark:bg-gray-400" 
      : type === "error"
      ? "bg-red-500 dark:bg-red-400" 
      : type === "blackout"
      ? "bg-black dark:bg-white"
      : undefined;

  const classNames = clsx(
    "flex flex-row justify-center items-center py-1 rounded-lg active:opacity-80 ripple-[#333] ripple-bordered",
    heightClass,
    fullWidth && "w-full",
    bgClass,
    disabled && "!bg-slate-200",
    wide && "!px-16",
    extraClassNames
  );

  const textSize =
    size === "small" ? "text-sm" : size === "large" ? "text-xl" : "text-base";
  const lineHeight = size === "small" ? 16 : size === "large" ? 22 : 18;

  const textColorClass =
    type === "blackout"
      ? "text-white dark:text-black"
      : type
      ? "text-white"
      : "text-inherit";

  const textClassNames = clsx(
    disabled && "font-bold !text-slate-500",
    textColorClass,
    textSize,
    titleClassName
  );

  const TextContent = (
    <Text
      className={textClassNames}
      numberOfLines={2}
      ellipsizeMode="tail"
      style={{ flexShrink: 1, flexWrap: "wrap", textAlign: "center", lineHeight }}
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

  const pressable = (
    <Pressable
      key={`btn-${colorScheme}-${type}-${size}-${disabled}`} // <—
      disabled={disabled}
      className={classNames}
      {...pressableProps}
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
