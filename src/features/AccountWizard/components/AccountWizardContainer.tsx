import { View } from "react-native";
import type { ChildrenProps } from "@/types/childrenProps";

export const AccountWizardContainer = ({ children }: ChildrenProps) => {
  return (
    <View className="flex-1 flex flex-col items-center justify-center gap-8 max-w-md mx-auto p-4 w-full">
      {children}
    </View>
  );
};
