import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text } from "@/components/Text";
import type { StatusBadgeProps } from "./types";

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  icon,
  label,
  backgroundColor
}) => (
  <View
    className="flex flex-row items-center gap-1 px-2 py-0.5 rounded-full"
    style={{ backgroundColor }}
  >
    <Ionicons name={icon} size={12} color="white" />
    <Text
      style={{
        fontSize: 10,
        color: "white",
        fontWeight: "600",
      }}
    >
      {label}
    </Text>
  </View>
);
