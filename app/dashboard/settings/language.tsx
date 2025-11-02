import { Fragment } from "react";
import { LanguageSettingsScreen } from "@/features/Dashboard/Settings/Language";
import { AppAlert } from "@/features/Dashboard/components/AppAlert";

export default function Screen() {
  return (
    <Fragment>
       <AppAlert />
      <LanguageSettingsScreen />
    </Fragment>
  );
}
