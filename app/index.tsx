import { View } from "react-native";
import { useAppStore } from "@/hooks/useAppStore";
import { Redirect } from "expo-router";

export default function Screen() {
  const { isTermAgreed, authMethod } = useAppStore();

  if (!isTermAgreed) {
    return <Redirect href="/terms" />;
  }

  if (!authMethod) {
    return <Redirect href="/auth" />;
  }

  return <View></View>;
}
