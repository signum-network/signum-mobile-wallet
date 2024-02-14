import { View, Pressable } from "react-native";
import { Text } from "@/components/Text";
import Checkbox from "expo-checkbox";
import clsx from "clsx";

interface Props {
  value: boolean;
  onPress: () => void;
  title: string;
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
  const classNames = clsx([
    "flex flex-row justify-center items-center gap-4 p-4",
    fullWidth && "w-full",
    bordered &&
      "border-2 border-card-border dark:border-card-border-dark rounded-lg",
  ]);

  return (
    <Pressable className={classNames} onPress={onPress}>
      <Checkbox value={value} />

      <View className="flex-col items-start justify-start">
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
