import { Text as NativeText } from "react-native";
import clsx from "clsx";

interface Props {
  color?: "primary" | "content" | "muted" | "error";
  size?: "small" | "medium" | "large";
  className?: string;
  fullWidth?: boolean;
  children: string;
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
    color === "content" && "text-black dark:text-white",
    color === "muted" &&
      "text-muted-foreground dark:text-muted-foreground-dark",
    size === "small" && "text-sm",
    size === "large" && "text-lg",
    fullWidth && "w-full",
    className && className,
  ]);

  return <NativeText className={classNames}>{children}</NativeText>;
};
