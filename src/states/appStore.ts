import type { ColorSchemeName } from "react-native";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getDefaultLocale, type locales } from "@/locales";
import type { authMethod } from "@/types/authMethod";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface State {
  themeMode: ColorSchemeName;
  language: locales;
  isTermAgreed: boolean; // Determine whether the user has agreed to terms of service
  isAuthEnrolled: boolean; // Determine whether the user has enrolled for authentication.
  authMethod: authMethod; // Determine the method the user will use for authentication (PIN or Biometric)
  failedAuthAttempts: number;
  isOnline: boolean; // Determine whether the user has internet access
  minerMode: boolean; // Determine whether the user has enabled miner mode for handling commitment
}

interface Actions {
  reset: () => void;
  toggleThemeMode: () => void;
  setLanguage: (value: locales) => void;
  setIsTermAgreed: (value: boolean) => void;
  setIsAuthEnrolled: (value: boolean) => void;
  setAuthMethod: (value: authMethod) => void;
  setFailedAuthAttempts: (value: number) => void;
  setIsOnline: (value: boolean) => void;
  setMinerMode: (value: boolean) => void;
}

const initialState: State = {
  themeMode: null as ColorSchemeName,
  language: getDefaultLocale(),
  isTermAgreed: false,
  isAuthEnrolled: false,
  authMethod: "PIN",
  failedAuthAttempts: 0,
  isOnline: true,
  minerMode: false,
};

export const appStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,
      reset: () => {
        set(initialState);
      },
      toggleThemeMode: () =>
        set(() => ({
          themeMode: get().themeMode === "dark" ? "light" : "dark",
        })),
      setLanguage: (value) =>
        set(() => ({
          language: value,
        })),
      setIsTermAgreed: (value) =>
        set(() => ({
          isTermAgreed: value,
        })),
      setIsAuthEnrolled: (value) =>
        set(() => ({
          isAuthEnrolled: value,
        })),
      setAuthMethod: (value) =>
        set(() => ({
          authMethod: value,
        })),
      setFailedAuthAttempts: (value) =>
        set(() => ({
          failedAuthAttempts: value,
        })),
      setIsOnline: (value) =>
        set(() => ({
          isOnline: value,
        })),
      setMinerMode: (value) =>
        set(() => ({
          minerMode: value,
        })),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);
