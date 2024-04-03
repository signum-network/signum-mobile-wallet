import { Fragment } from "react";
import { Text } from "@/components/Text";
import { AppAlert } from "@/features/Dashboard/components/AppAlert";

export default function Screen() {
  return (
    <Fragment>
      <AppAlert />
      <Text>Deposit Screen</Text>
    </Fragment>
  );
}
