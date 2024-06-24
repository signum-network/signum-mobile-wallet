import "intl-pluralrules";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";

import enTranslation from "./en.json";
import esTranslation from "./es.json";
import ptTranslation from "./pt.json";

export type locales = "en" | "es" | "pt" | "de";
const supportedLngs: locales[] = ["en", "es", "pt", "de"];

export const lngCards: { lng: locales; label: string }[] = [
  { lng: "en", label: "English" },
];

export const defaultSeparator = { thousand: ",", decimal: "." };
const europeanSeparator = { thousand: ".", decimal: "," };
export const languageSeparators = new Map<locales, typeof defaultSeparator>([
  ["en", defaultSeparator],
  ["es", defaultSeparator],
  ["pt", defaultSeparator],
  ["de", europeanSeparator],
]);

export const getDefaultLocale = (): locales => {
  const deviceLanguage = getLocales();
  const languageCode = deviceLanguage[0]?.languageCode;

  // @ts-expect-error If device language is not on the supported language list, fallback to english
  if (!languageCode || !supportedLngs.includes(languageCode)) {
    return "en";
  }

  // @ts-expect-error Return supported language
  return languageCode;
};

i18n.use(initReactI18next).init({
  fallbackLng: getDefaultLocale(),
  supportedLngs,
  resources: {
    en: {
      translation: enTranslation,
    },
    es: {
      translation: esTranslation,
    },
    pt: {
      translation: ptTranslation,
    },
  },
});
