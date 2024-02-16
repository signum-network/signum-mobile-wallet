import { Fragment } from "react";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { TermsScreen } from "@/features/Terms";

export default function Screen() {
  return (
    <Fragment>
      <StatusBar
        style={Platform.OS === "ios" ? "dark" : "light"}
        backgroundColor="#0099ff"
        translucent
      />
      <TermsScreen />
    </Fragment>
  );
}
