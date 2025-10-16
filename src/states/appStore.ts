import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getDefaultLocale, type locales } from "@/locales";
import type { authMethod } from "@/types/authMethod";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemePreference = "system" | "light" | "dark";

interface State {
  themeMode: ThemePreference;            
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
  setThemeMode: (value: ThemePreference) => void; 
  cycleThemeMode: () => void;                     
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
  themeMode: "system",               
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
      reset: () => set(initialState),

      setThemeMode: (value) => set({ themeMode: value }),
      cycleThemeMode: () =>
        set((state) => ({
          themeMode:
            state.themeMode === "system"
              ? "dark"
              : state.themeMode === "dark"
              ? "light"
              : "system",
        })),


      toggleThemeMode: () =>
        set((state) => ({
          themeMode: state.themeMode === "dark" ? "light" : "dark",
        })),

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
      version: 2,
      migrate: async (persisted: any) => {
        if (!persisted) return persisted;
        if (!persisted.themeMode) persisted.themeMode = "system";
        return persisted;
      },
    }
  )
);
