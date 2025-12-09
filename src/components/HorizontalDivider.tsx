import { View } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";

export const HorizontalDivider = () => {
  const { tokens } = useAppTheme();

  return (
    <View
      className="w-full"
      style={{
        height: 0.5,
        backgroundColor: tokens.border,
      }}
    />
  );
};
