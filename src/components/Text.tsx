import { Text as NativeText } from "react-native";
import clsx from "clsx";

interface Props {
  color?: "primary" | "content" | "muted" | "error";
  size?: "small" | "medium" | "large" | "extraLarge";
  className?: string;
  fullWidth?: boolean;
  children: any;
}

export const Text = ({
  color = "content",
  size = "medium",
  className,
  fullWidth,
  children,
}: Props) => {
  const classNames = clsx([
    color === "primary" && "text-signum dark:text-signum-dark",
    color === "error" && "text-red-500",
    color === "content" && "text-black dark:text-white",
    color === "muted" &&
      "text-muted-foreground dark:text-muted-foreground-dark",
    size === "small" && "text-sm",
    size === "large" && "text-lg",
    size === "extraLarge" && "text-3xl",
    fullWidth && "w-full",
    className && className,
  ]);

  return <NativeText className={classNames}>{children}</NativeText>;
};
