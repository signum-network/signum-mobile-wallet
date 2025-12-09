import { View } from "react-native";
import type { ChildrenProps } from "@/types/childrenProps";
import { PUBLIC_CURRENT_OS } from "@/types/constants";
import { useAppTheme } from "@/hooks/useAppTheme";

export const BottomButtonsContainer = ({ children }: ChildrenProps) => {
  const { tokens } = useAppTheme();

  return (
    <View
      style={{
        zIndex: 250,
        position: "absolute",
        left: 0,
        bottom: 0,
        elevation: PUBLIC_CURRENT_OS === "android" ? 50 : 0,
        height: 78,
        backgroundColor: tokens.background,
        borderTopWidth: 1,
        borderColor: tokens.border,
      }}
      className="flex flex-row justify-around items-center w-full px-4 gap-2"
    >
      {children}
    </View>
  );
};
