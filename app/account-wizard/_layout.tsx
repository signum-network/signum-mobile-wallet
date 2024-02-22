import { Slot } from "expo-router";
import { View } from "react-native";

export default function Layout() {
  return (
    <View className="flex-1 flex flex-col items-start justify-start gap-8 max-w-md mx-auto p-4">
      <Slot />
    </View>
  );
}
