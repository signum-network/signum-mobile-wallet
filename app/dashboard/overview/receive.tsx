import { Fragment } from "react";
import { AppAlert } from "@/features/Dashboard/components/AppAlert";
import { DepositScreen } from "@/features/Dashboard/Deposit";

export default function Screen() {
  return (
    <Fragment>
      <AppAlert />
      <DepositScreen />
    </Fragment>
  );
}
