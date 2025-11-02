import { Fragment } from "react";
import { ProtectedScreen } from "@/features/Dashboard/components/ProtectedScreen";
import { ActivityScreen } from "@/features/Dashboard/Overview/Activity";

export default function Screen() {
  return (
    <Fragment>
      <ProtectedScreen>
        <ActivityScreen />
      </ProtectedScreen>
    </Fragment>
  );
}
