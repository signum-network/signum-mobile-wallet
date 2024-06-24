import { appStore } from "@/states/appStore";
import { languageSeparators, defaultSeparator } from "@/locales";

export const useNumberSeparator = () => {
  const language = appStore((state) => state.language);

  return languageSeparators.get(language) ?? defaultSeparator;
};
