import { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { appStore } from "@/states/appStore";
import { ChildrenProps } from "@/types/childrenProps";

export const AppTranslationsProvider = ({ children }: ChildrenProps) => {
  const { i18n } = useTranslation();
  const language = appStore((state) => state.language);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return <Fragment>{children}</Fragment>;
};
