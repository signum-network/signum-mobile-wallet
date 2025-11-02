import { Fragment } from "react";
import { CreateScreen } from "@/features/AccountWizard/Create";
import { AppAlert } from "@/features/Dashboard/components/AppAlert";

export default function Screen() {
  return (
    <Fragment>
      <AppAlert />
      <CreateScreen />
    </Fragment>
  );
}
