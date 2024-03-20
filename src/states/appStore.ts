import { Appearance, type ColorSchemeName } from "react-native";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getDefaultLocale, type locales } from "@/locales";
import type { authMethod } from "@/types/authMethod";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface State {
  themeMode: ColorSchemeName;
  language: locales;
  isTermAgreed: boolean;
  authMethod: authMethod;
}

interface Actions {
  toggleThemeMode: () => void;
  setLanguage: (value: locales) => void;
  setIsTermAgreed: (value: boolean) => void;
  setAuthMethod: (value: authMethod) => void;
}

const initialState: State = {
  themeMode: Appearance.getColorScheme(),
  language: getDefaultLocale(),
  isTermAgreed: false,
  authMethod: "",
};

export const appStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,
      toggleThemeMode: () =>
        set(() => ({
          themeMode: get().themeMode === "dark" ? "light" : "dark",
        })),
      setLanguage: (value: locales) =>
        set(() => ({
          language: value,
        })),
      setIsTermAgreed: (value: boolean) =>
        set(() => ({
          isTermAgreed: value,
        })),
      setAuthMethod: (value: authMethod) =>
        set(() => ({
          authMethod: value,
        })),
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
