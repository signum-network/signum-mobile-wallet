import { Fragment } from "react";
import { AccountManager } from "@/features/Dashboard/components/AccountManager";
import { AppAlert } from "@/features/Dashboard/components/AppAlert";

export default function Screen() {
  return (
    <Fragment>
      <AppAlert />
      <AccountManager />
    </Fragment>
  );
}
