import { create } from "zustand";
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
}

const systemScheme = Appearance.getColorScheme(); // "light" | "dark" | null

const initialThemeDesign: ThemeDesign =
  systemScheme === "dark" ? "defaultDark" : "defaultLight";

const initialState: State = {
  themeDesign: initialThemeDesign,
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
    (set) => ({
      ...initialState,
      reset: () => set(initialState),

      setThemeDesign: (value) => set({ themeDesign: value }),
      setLanguage: (value) => set({ language: value }),
      setIsTermAgreed: (value) => set({ isTermAgreed: value }),
      setIsAuthEnrolled: (value) => set({ isAuthEnrolled: value }),
      setAuthMethod: (value) => set({ authMethod: value }),
      setFailedAuthAttempts: (value) => set({ failedAuthAttempts: value }),
      setIsOnline: (value) => set({ isOnline: value }),
      setMinerMode: (value) => set({ minerMode: value }),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);
