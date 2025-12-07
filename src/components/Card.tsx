import { View } from "react-native";
import type { ChildrenProps } from "@/types/childrenProps";
import { useAppTheme } from "@/hooks/useAppTheme";

export const Card = ({ children }: ChildrenProps) => {
  const { tokens } = useAppTheme();

  return (
    <View
      className="flex flex-col justify-start items-start gap-4 p-4 rounded-lg w-full"
      style={{
        backgroundColor: tokens.surface,
        borderWidth: 1,
        borderColor: tokens.border,
      }}
    >
      {children}
    </View>
  );
};
