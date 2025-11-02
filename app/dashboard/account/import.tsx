import { Fragment } from "react";
import { ImportScreen } from "@/features/AccountWizard/Import";
import { AppAlert } from "@/features/Dashboard/components/AppAlert";

export default function Screen() {
  return (
    <Fragment>
      <AppAlert />
      <ImportScreen />
    </Fragment>
  );
}
