import { View, Pressable } from "react-native";
import { Text } from "@/components/Text";
import { useAppTheme } from "@/hooks/useAppTheme";

export type ViewMode = "parsed" | "json";

interface Props {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

export const ViewModeToggle = ({ mode, onModeChange }: Props) => {
  const { tokens } = useAppTheme();

  return (
    <View className="flex flex-row gap-2 w-full">
      <Pressable
        onPress={() => onModeChange("parsed")}
        className="flex-1"
        style={{
          backgroundColor:
            mode === "parsed" ? tokens.surface : tokens.surfaceElevated,
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 8,
        }}
      >
        <Text
          className="text-center font-medium"
          color={mode === "parsed" ? "primary" : "muted"}
        >
          Parsed View
        </Text>
      </Pressable>

      <Pressable
        onPress={() => onModeChange("json")}
        className="flex-1"
        style={{
          backgroundColor:
            mode === "json" ? tokens.surface : tokens.surfaceElevated,
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 8,
        }}
      >
        <Text
          className="text-center font-medium"
          color={mode === "json" ? "primary" : "muted"}
        >
          JSON View
        </Text>
      </Pressable>
    </View>
  );
};
