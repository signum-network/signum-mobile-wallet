import clsx from "clsx";
import { Link } from "expo-router";
import { LinkProps } from "expo-router/build/link/Link";
import { Pressable, PressableProps, Text, View } from "react-native";

interface CustomButtonProps {
  type: "primary" | "secondary";
  linkProps?: LinkProps;
  pressableProps?: PressableProps;
  title?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export const CustomButton = ({
  type,
  linkProps,
  pressableProps,
  title,
  icon,
  fullWidth,
  children,
}: CustomButtonProps) => {
  const classNames = clsx([
    "flex-row justify-center items-center px-4 py-4 rounded-lg",
    fullWidth && "w-full",
    type === "primary" && "bg-signum",
    type === "secondary" && "bg-gray-500",
  ]);

  if (linkProps) {
    return (
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
