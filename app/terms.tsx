import { Fragment } from "react";
import { StatusBar } from "expo-status-bar";
import { TermsScreen } from "@/features/Terms";

export default function Screen() {
  return (
    <Fragment>
      <StatusBar style="light" backgroundColor="#0099ff" />
      <TermsScreen />
    </Fragment>
  );
}
