import { useRouter } from "expo-router";
import { useDatabase } from "@/hooks/useDatabase";
import { resetWallet } from "@/utils/resetWallet";

interface UseResetAppOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  navigateTo?: string;
  delay?: number;
}

export const useResetApp = (options?: UseResetAppOptions) => {
  const router = useRouter();
  const db = useDatabase();

  const {
    onSuccess,
    onError,
    navigateTo = "/terms",
    delay = 1000,
  } = options || {};

  const resetApp = async (): Promise<void> => {
    try {
      await resetWallet(db);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Navigate after delay to ensure all operations complete
      setTimeout(() => {
        router.replace(navigateTo as any);
      }, delay);
    } catch (error) {
      console.error("Error resetting app:", error);

      // Call error callback if provided
      if (onError) {
        onError(error as Error);
      } else {
        // Default error handling
        throw error;
      }
    }
  };

  return { resetApp };
};
