import { View, Platform } from "react-native";
import type { ChildrenProps } from "@/types/childrenProps";

export const BottomButtonsContainer = ({ children }: ChildrenProps) => (
  <View
    style={{
      zIndex: 250,
      position: "absolute",
      left: 0,
      bottom: 0,
      elevation: Platform.OS === "android" ? 50 : 0,
      height: 81.4,
    }}
    className="flex flex-row justify-around items-center w-full px-4 bg-card-foreground dark:bg-card-foreground-dark border-t border-card-border dark:border-card-border-dark"
  >
    {children}
  </View>
);
