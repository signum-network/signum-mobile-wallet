import { Fragment } from "react";
import { SettingsScreen } from "@/features/Dashboard/Settings/Home";
import { AppAlert } from "@/features/Dashboard/components/AppAlert";

export default function Screen() {
  return (
    <Fragment>
      <AppAlert />
      <SettingsScreen />
    </Fragment>
  );
}
