import { create } from "zustand";
import { registerStore } from "@/states/storeRegistry";
import { persist, createJSONStorage } from "zustand/middleware";
import { getDefaultLocale, type locales } from "@/locales";
import type { authMethod } from "@/types/authMethod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ThemeDesign } from "@/theme/tokens";
import { Appearance } from "react-native";

interface State {
  themeDesign: ThemeDesign;
  language: locales;
  isTermAgreed: boolean;
  isAuthEnrolled: boolean;
  authMethod: authMethod;
  failedAuthAttempts: number;
  isOnline: boolean;
  minerMode: boolean;
  isUnlocked: boolean;
}

interface Actions {
  reset: () => void;
  setThemeDesign: (value: ThemeDesign) => void;
  setLanguage: (value: locales) => void;
  setIsTermAgreed: (value: boolean) => void;
  setIsAuthEnrolled: (value: boolean) => void;
  setAuthMethod: (value: authMethod) => void;
  setFailedAuthAttempts: (value: number) => void;
  setIsOnline: (value: boolean) => void;
  setMinerMode: (value: boolean) => void;
  setIsUnlocked: (value: boolean) => void;
}

const systemScheme = Appearance.getColorScheme(); // "light" | "dark" | null

const initialThemeDesign: ThemeDesign =
  systemScheme === "dark" ? "defaultDark" : "defaultLight";

const getInitialState = () => ({
  themeDesign: initialThemeDesign,
  language: getDefaultLocale(),
  isTermAgreed: false,
  isAuthEnrolled: false,
  authMethod: "PIN",
  failedAuthAttempts: 0,
  isOnline: true,
  minerMode: false,
  isUnlocked: false,
}) as State;

export const appStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...getInitialState(),
      reset: () => set(getInitialState()),

      setThemeDesign: (value) => set({ themeDesign: value }),
      setLanguage: (value) => set({ language: value }),
      setIsTermAgreed: (value) => set({ isTermAgreed: value }),
      setIsAuthEnrolled: (value) => set({ isAuthEnrolled: value }),
      setAuthMethod: (value) => set({ authMethod: value }),
      setFailedAuthAttempts: (value) => set({ failedAuthAttempts: value }),
      setIsOnline: (value) => set({ isOnline: value }),
      setMinerMode: (value) => set({ minerMode: value }),
      setIsUnlocked: (value) => set({ isUnlocked: value }),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      partialize: (state) => {
        const { isUnlocked, ...rest } = state;
        return rest;
      },
    }
  )
);
registerStore(appStore);
