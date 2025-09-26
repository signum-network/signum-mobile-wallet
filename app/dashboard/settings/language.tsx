import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { LanguageSettingsScreen } from "@/features/Dashboard/Settings/Language";
import { AppAlert } from "@/features/Dashboard/components/AppAlert";


export default function Screen() {
  const { t } = useTranslation();

  return (
    <Fragment>
       <AppAlert />
      <LanguageSettingsScreen />
    </Fragment>
  );
}
