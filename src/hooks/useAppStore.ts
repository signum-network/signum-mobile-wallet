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

  const isOnline = appStore((state) => state.isOnline);
  const setIsOnline = appStore((state) => state.setIsOnline);

  const minerMode = appStore((state) => state.minerMode);
  const setMinerMode = appStore((state) => state.setMinerMode);

  const resetAppStore = appStore((state) => state.reset);

  return {
    isTermAgreed,
    language,
    isAuthEnrolled,
    authMethod,
    failedAuthAttempts,
    isOnline,
    minerMode,
    setIsTermAgreed,
    setLanguage,
    setIsAuthEnrolled,
    setAuthMethod,
    setFailedAuthAttempts,
    setIsOnline,
    setMinerMode,
    resetAppStore,
  };
};
