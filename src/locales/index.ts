import "intl-pluralrules";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";

import enTranslation from "./en.json";
import esTranslation from "./es.json";
import ptTranslation from "./pt.json";

export type locales = "en" | "es" | "pt";
const supportedLngs: locales[] = ["en", "es", "pt"];

export const getDefaultLocale = (): locales => {
  // Get device language
  const deviceLanguage = getLocales();
  const languageCode = deviceLanguage[0]?.languageCode;

  // @ts-expect-error If device language is not on the support language list, fallback to english
  if (!languageCode || !supportedLngs.includes(languageCode)) {
    return "en";
  }

  // @ts-expect-error Return supported language
  return languageCode;
};

i18n.use(initReactI18next).init({
  // debug: process.env.NODE_ENV === "development",
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
