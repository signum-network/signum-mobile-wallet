import { Pressable, View } from "react-native";
import { Text } from "@/components/Text";
import { useAppTheme } from "@/hooks/useAppTheme";

interface Props {
  value: boolean;
  onPress: () => void;
  label?: string;
  disabled?: boolean;
}

export const ToggleSwitch = ({ value, onPress, label, disabled }: Props) => {
  const { tokens } = useAppTheme();

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      onPress={onPress}
      disabled={disabled}
      className="flex-row items-center gap-3"
      style={{ opacity: disabled ? 0.6 : 1 }}
    >
      <View
        style={{
          width: 35,
          height: 20,
          borderRadius: 10,
          borderColor: value ? tokens.textMuted : tokens.textMuted,
          borderWidth: 1,
          padding: 2,
          backgroundColor: value ? tokens.surface : tokens.surface,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: value ? tokens.primary : tokens.text,
            alignSelf: value ? "flex-end" : "flex-start",
            elevation: 3,
          }}
        />
      </View>

      {!!label && (
        <Text size="small" className="font-medium">
          {label}
        </Text>
      )}
    </Pressable>
  );
};
