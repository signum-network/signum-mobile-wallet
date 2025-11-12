import { View } from "react-native";
import type { ChildrenProps } from "@/types/childrenProps";

export const DashboardScreenContainer = ({ children }: ChildrenProps) => {
  return (
    <View className="flex-1 flex flex-col items-start justify-start gap-4">
      {children}
    </View>
  );
};
