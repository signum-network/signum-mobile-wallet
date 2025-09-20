import type { ReactNode } from "react";
import type { LinkProps } from "expo-router/build/link/Link";
import { Link } from "expo-router";
import { Pressable, PressableProps, Text, View } from "react-native";
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
  const classNames = clsx([
    "flex flex-row justify-center items-center px-4 py-4 rounded-lg active:opacity-80 ripple-[#333] ripple-bordered",
    fullWidth && "w-full",
    type === "primary" && "bg-signum dark:bg-signum-dark",
    type === "secondary" && "bg-gray-500",
    type === "error" && "bg-red-500",
    type === "blackout" && "bg-black dark:bg-white",
    disabled && "!bg-slate-200",
    wide && "!px-16",
    extraClassNames && extraClassNames,
  ]);

  const textClassNames = clsx([
    disabled && "font-bold !color-slate-500",
    type && "color-white",
    type === "blackout" && "dark:color-black",
    size === "small" && "text-sm",
    size === "large" && "text-xl",
    titleClassName,
  ]);

  if (linkProps) {
    return (
      <Link {...linkProps} asChild>
        <Pressable
          disabled={disabled}
          className={classNames}
          {...pressableProps}
        >
          {icon && <View className="mr-4">{icon}</View>}
          {title && <Text className={textClassNames}>{title}</Text>}
          {children && children}
        </Pressable>
      </Link>
    );
  }

  return (
    <Pressable disabled={disabled} className={classNames} {...pressableProps}>
      {icon && <View className={title && "mr-4"}>{icon}</View>}
      {title && <Text className={textClassNames}>{title}</Text>}
      {children && children}
    </Pressable>
  );
};
