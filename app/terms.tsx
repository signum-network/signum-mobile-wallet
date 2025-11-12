import { Fragment } from "react";
import { SystemBars } from "react-native-edge-to-edge";
import { TermsScreen } from "@/features/Terms";
import { PUBLIC_CURRENT_OS } from "@/types/constants";

export default function Screen() {
  return (
    <Fragment>
      <SystemBars style={PUBLIC_CURRENT_OS === "ios" ? "dark" : "light"} />
      <TermsScreen />
    </Fragment>
  );
}
