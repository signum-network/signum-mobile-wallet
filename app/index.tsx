import { useAppStore } from "@/hooks/useAppStore";
import { Redirect } from "expo-router";

export default function Screen() {
  const { isTermAgreed } = useAppStore();

  if (!isTermAgreed) {
    return <Redirect href="/terms" />;
  }

  return <Redirect href="/auth" />;
}
