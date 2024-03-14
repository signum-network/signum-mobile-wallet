import { View, Pressable } from "react-native";
import { Text } from "@/components/Text";
import NativeCheckbox from "expo-checkbox";
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
    "flex flex-row justify-center items-center gap-4 p-4 bg-card-foreground dark:bg-card-foreground-dark",
    fullWidth && "w-full",
    bordered &&
      "border border-card-border dark:border-card-border-dark rounded-lg",
  ]);

  return (
    <Pressable className={classNames} onPress={onPress}>
      <View className="w-1/12  flex justify-center items-center">
        <NativeCheckbox value={value} />
      </View>

      <View className="w-11/12  flex-col items-start justify-start">
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
