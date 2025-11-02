import { Fragment } from "react";
import { NodeSettingsScreen } from "@/features/Dashboard/Settings/Nodes";
import { AppAlert } from "@/features/Dashboard/components/AppAlert";

export default function Screen() {
  return (
    <Fragment>
      <AppAlert />
      <NodeSettingsScreen />
    </Fragment>
  );
}
