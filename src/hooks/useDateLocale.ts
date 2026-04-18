import { useTranslation } from "react-i18next";

// Import all date-fns locales
import { enUS, es, pt, fr, de, zhCN, ru, uk } from "date-fns/locale";

export const useDateLocale = () => {
  const { i18n } = useTranslation();

  switch (i18n.language) {
    case "de":
      return de;
    case "es":
      return es;
    case "pt":
      return pt;      
    case "fr":
      return fr;
    case "zh":
      return zhCN;
    case "ru":
      return ru;
    case "uk":
      return uk;
    default:
      return enUS;
  }
};
