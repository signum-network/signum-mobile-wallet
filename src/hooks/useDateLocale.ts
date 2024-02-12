import { useMemo } from "react";
import { appStore } from "@/states/appStore";
import { enUS, es, ptBR } from "date-fns/locale";

export const useDateLocale = () => {
  const language = appStore((state) => state.language);

  const dateLocale = useMemo(() => {
    switch (language) {
      case "es":
        return es;

      case "pt":
        return ptBR;

      default:
        return enUS;
    }
  }, [language]);

  return dateLocale;
};
