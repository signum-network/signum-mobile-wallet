import { Appearance, type ColorSchemeName } from "react-native";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getDefaultLocale, type locales } from "@/locales";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppStore {
  themeMode: ColorSchemeName;
  toggleThemeMode: () => void;
  language: locales;
  setLanguage: (value: locales) => void;
}

const defaultTheme: ColorSchemeName = Appearance.getColorScheme();
const defaultLanguage = getDefaultLocale();

export const appStore = create<AppStore>()(
  persist(
    (set, get) => ({
      themeMode: defaultTheme,
      toggleThemeMode: () =>
        set(() => ({
          themeMode: get().themeMode === "dark" ? "light" : "dark",
        })),
      language: defaultLanguage,
      setLanguage: (value: locales) =>
        set(() => ({
          language: value,
        })),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
