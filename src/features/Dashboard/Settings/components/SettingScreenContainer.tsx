import { View } from "react-native";
import type { ChildrenProps } from "@/types/childrenProps";

export const SettingScreenContainer = ({ children }: ChildrenProps) => {
  return (
    <View className="flex-1 flex flex-col items-start justify-start mb-8 gap-4">
      {children}
    </View>
  );
};
