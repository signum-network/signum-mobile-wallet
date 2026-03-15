import { View, type ViewStyle } from "react-native";
import clsx from "clsx";
import type { ChildrenProps } from "@/types/childrenProps";
import { useAppTheme } from "@/hooks/useAppTheme";

type CardProps = ChildrenProps & {
  className?: string;
  style?: ViewStyle | ViewStyle[];
  active?: boolean;
};

export const Card = ({
  children,
  className,
  style,
  active = false,
}: CardProps) => {
  const { tokens } = useAppTheme();

  return (
    <View
      className={clsx(
        "flex flex-col justify-start items-start gap-4 p-4 rounded-xl w-full",
        className
      )}
      style={[
        {
          backgroundColor: active
            ? tokens.surfaceElevated
            : tokens.surface,
          borderWidth: 2,
          borderColor: active
            ? tokens.success
            : tokens.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};