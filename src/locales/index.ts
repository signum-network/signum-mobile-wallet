import "intl-pluralrules";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";

import enTranslation from "./en.json";
import esTranslation from "./es.json";
import ptTranslation from "./pt.json";
import frTranslation from "./fr.json";
import deTranslation from "./de.json";
import zhTranslation from "./zh.json";
import ruTranslation from "./ru.json";

// Use canonical ISO codes (zh instead of cn)
export type Locales = "en" | "es" | "pt" | "fr" | "de" | "zh" | "ru";
export type locales = Locales; // backwards compatibility if other files import `locales`

export const lngCards: { lng: locales; label: string }[] = [
  { lng: "en", label: "English" },
  { lng: "es", label: "Spanish" },
  { lng: "pt", label: "Portuguese" },
  { lng: "fr", label: "French" },
  { lng: "de", label: "German" },
  { lng: "zh", label: "Chinese" },
  { lng: "ru", label: "Russian" },
];

const SUPPORTED = new Set<Locales>(["en", "es", "pt", "fr", "de", "zh", "ru"]);

// Separators: prefer NBSP for Russian thousand separator for nicer grouping
type Separator = Readonly<{ thousand: string; decimal: string }>;

export const defaultSeparator: Separator = { thousand: ",", decimal: "." };
export const europeanSeparator: Separator = { thousand: ".", decimal: "," };
export const russianSeparator: Separator = { thousand: " ", decimal: "," }; // NBSP
export const languageSeparators = new Map<Locales, Separator>([
  ["en", defaultSeparator],
  ["es", europeanSeparator],
  ["pt", europeanSeparator],
  ["fr", europeanSeparator],
  ["de", europeanSeparator],
  ["zh", defaultSeparator], 
  ["ru", russianSeparator],
]);

// Normalize locale codes coming from the device (e.g., pt-BR → pt, zh-CN → zh)
const normalizeLocale = (code?: string): Locales => {
  if (!code) return "en";
  const lc = code.toLowerCase();

  // Handle tags like "pt-BR", "zh-CN", "fr-CA", etc.
  if (lc.startsWith("zh")) return "zh";
  if (lc.startsWith("pt")) return "pt";

  const base = (lc.split(/[-_]/)[0] as Locales) || "en";
  return SUPPORTED.has(base) ? base : "en";
};

export const getDefaultLocale = (): Locales => {
  const localesArr = getLocales();
  const primary = localesArr[0];
  // Prefer full languageTag when available, otherwise languageCode
  const code = (primary as any)?.languageTag || primary?.languageCode;
  return normalizeLocale(code);
};

i18n
  .use(initReactI18next)
  .init({
    // IMPORTANT: set initial language explicitly
    lng: getDefaultLocale(),
    // Understandable fallback (not dynamic)
    fallbackLng: "en",
    supportedLngs: Array.from(SUPPORTED),
    resources: {
      en: { translation: enTranslation },
      es: { translation: esTranslation },
      pt: { translation: ptTranslation },
      fr: { translation: frTranslation },
      de: { translation: deTranslation },
      zh: { translation: zhTranslation },
      ru: { translation: ruTranslation },
    },
    // React-specific options
    react: {
      useSuspense: false, // avoids suspense renders during language changes
    },
    interpolation: {
      escapeValue: false, // React escapes by itself
    },
    // Prefer returning the key instead of null when missing
    returnNull: false,
  });

// Optional: log missing translation keys in dev builds
if (__DEV__) {
  i18n.on("missingKey", (lngs, ns, key) => {
    // eslint-disable-next-line no-console
    console.warn(`[i18n] Missing key: ${key} (ns: ${ns}, lngs: ${lngs})`);
  });
}

export default i18n;
