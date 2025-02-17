import { Fragment } from "react";
import { StatusBar } from "expo-status-bar";
import { TermsScreen } from "@/features/Terms";
import { PUBLIC_CURRENT_OS } from "@/types/constants";

export default function Screen() {
  return (
    <Fragment>
      <StatusBar
        style={PUBLIC_CURRENT_OS === "ios" ? "dark" : "light"}
        backgroundColor="#0099ff"
        translucent
      />
      <TermsScreen />
    </Fragment>
  );
}
