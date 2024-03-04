import { View } from "react-native";
import type { ChildrenProps } from "@/types/childrenProps";

export const Card = ({ children }: ChildrenProps) => {
  return (
    <View className="flex flex-col justify-start items-start gap-4 p-4 bg-card-foreground dark:bg-card-foreground-dark border border-card-border dark:border-card-border-dark rounded-lg w-full">
      {children}
    </View>
  );
};
