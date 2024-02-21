import { useAppStore } from "@/hooks/useAppStore";
import { Redirect } from "expo-router";

export default function Screen() {
  const { isTermAgreed, isAuthEnrolled } = useAppStore();

  if (!isTermAgreed) {
    return <Redirect href="/terms" />;
  }

  if (!isAuthEnrolled) {
    return <Redirect href="/auth/enroll" />;
  }

  // TODO: After testing the generateHashes feature, change the href to /auth/login
  return <Redirect href="/auth/enroll" />;
}
