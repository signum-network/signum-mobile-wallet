import type { ReactNode } from "react";
import type { LinkProps } from "expo-router/build/link/Link";
import { Link } from "expo-router";
import { Pressable, PressableProps, Text, View } from "react-native";
import clsx from "clsx";

interface Props {
  type: "primary" | "secondary";
  linkProps?: LinkProps;
  pressableProps?: PressableProps;
  title?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
  children?: ReactNode;
}

export const Button = ({
  type,
  linkProps,
  pressableProps,
  title,
  icon,
  fullWidth,
  children,
}: Props) => {
  const classNames = clsx([
    "flex-row justify-center items-center px-4 py-4 rounded-lg",
    fullWidth && "w-full",
    type === "primary" && "bg-signum",
    type === "secondary" && "bg-gray-500",
  ]);

  if (linkProps) {
    return (
      // @ts-expect-error Routes are statically typed
      <Link {...linkProps} asChild>
        <Pressable className={classNames} {...pressableProps}>
          {icon && <View className="mr-4">{icon}</View>}
          {title && (
            <Text className={clsx([type && "color-white"])}>{title}</Text>
          )}
          {children && children}
        </Pressable>
      </Link>
    );
  }

  return (
    <Pressable className={classNames} {...pressableProps}>
      {icon && <View className="mr-4">{icon}</View>}
      {title && <Text className={clsx([type && "color-white"])}>{title}</Text>}
      {children && children}
    </Pressable>
  );
};
