import { appStore } from "@/states/appStore";

export const useAppStore = () => {
  const isTermAgreed = appStore((state) => state.isTermAgreed);
  const setIsTermAgreed = appStore((state) => state.setIsTermAgreed);

  const language = appStore((state) => state.language);
  const setLanguage = appStore((state) => state.setLanguage);

  const isAuthEnrolled = appStore((state) => state.isAuthEnrolled);
  const setIsAuthEnrolled = appStore((state) => state.setIsAuthEnrolled);

  const authMethod = appStore((state) => state.authMethod);
  const setAuthMethod = appStore((state) => state.setAuthMethod);

  const failedAuthAttempts = appStore((state) => state.failedAuthAttempts);
  const setFailedAuthAttempts = appStore(
    (state) => state.setFailedAuthAttempts
  );

  const isConnected = appStore((state) => state.isConnected);
  const setIsConnected = appStore((state) => state.setIsConnected);

  const resetAppStore = appStore((state) => state.reset);

  return {
    isTermAgreed,
    language,
    isAuthEnrolled,
    authMethod,
    failedAuthAttempts,
    isConnected,
    setIsTermAgreed,
    setLanguage,
    setIsAuthEnrolled,
    setAuthMethod,
    setFailedAuthAttempts,
    setIsConnected,
    resetAppStore,
  };
};
