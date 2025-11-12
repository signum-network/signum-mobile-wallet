import { View } from "react-native";
import type { ChildrenProps } from "@/types/childrenProps";
import { PUBLIC_CURRENT_OS } from "@/types/constants";

export const BottomButtonsContainer = ({ children }: ChildrenProps) => (
  <View
    style={{
      zIndex: 250,
      position: "absolute",
      left: 0,
      bottom: 0,
      elevation: PUBLIC_CURRENT_OS === "android" ? 50 : 0,
      height: 78,
    }}
    className="flex flex-row justify-around items-center w-full px-4 bg-white dark:bg-black border-t border-card-border dark:border-card-border-dark gap-2"
  >
    {children}
  </View>
);
