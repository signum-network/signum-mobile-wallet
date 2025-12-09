import { View, Pressable } from "react-native";
import { Text } from "@/components/Text";
import { useAppTheme } from "@/hooks/useAppTheme";
import NativeCheckbox from "expo-checkbox";
import clsx from "clsx";
import type { ReactNode } from "react";

interface Props {
  value: boolean;
  onPress: () => void;
  title?: string | ReactNode;
  description?: string;
  bordered?: boolean;
  fullWidth?: boolean;
}

export const FormCheckbox = ({
  value,
  onPress,
  title,
  description,
  bordered,
  fullWidth,
}: Props) => {
  const { tokens, iconColor } = useAppTheme();

  const classNames = clsx(
    "flex flex-row justify-center items-center gap-4 p-4",
    fullWidth && "w-full",
    bordered && "rounded-lg"
  );

  return (
    <Pressable
      className={classNames}
      onPress={onPress}
      style={{
        backgroundColor: tokens.surface,
        borderWidth: bordered ? 1 : 0,
        borderColor: bordered ? tokens.border : undefined,
      }}
    >
      <View
        className="w-1/12 flex justify-center items-center"
        pointerEvents="none"
      >
        <NativeCheckbox
          value={value}
          color={iconColor.primary} // ← bereits tokenisiert
        />
      </View>

      <View className="w-11/12 flex-col items-start justify-start">
        <Text className="font-medium">{title}</Text>

        {description && (
          <Text color="muted" size="small">
            {description}
          </Text>
        )}
      </View>
    </Pressable>
  );
};
