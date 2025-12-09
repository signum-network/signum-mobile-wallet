import { Text as NativeText, TextStyle } from "react-native";
import clsx from "clsx";
import { useAppTheme } from "@/hooks/useAppTheme";

interface Props {
  color?: "primary" | "content" | "white" | "muted" | "error" | "success";
  size?: "extraSmall" | "small" | "medium" | "large" | "2large" | "extraLarge";
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
  const { tokens } = useAppTheme();

  const classNames = clsx([
    size === "extraSmall" && "text-xs",
    size === "small" && "text-sm",
    size === "medium" && "text-base",
    size === "large" && "text-lg",
    size === "2large" && "text-2xl",
    size === "extraLarge" && "text-3xl",
    fullWidth && "w-full",
    className && className,
  ]);

  const colorStyle: TextStyle = {
    color:
      color === "primary"
        ? tokens.primary
        : color === "muted"
        ? tokens.textMuted
        : color === "error"
        ? tokens.error
        : color === "success"
        ? tokens.success
        : color === "white"
        ? "#FFFFFF"
        : tokens.text,
  };

  return (
    <NativeText className={classNames} style={colorStyle}>
      {children}
    </NativeText>
  );
};
