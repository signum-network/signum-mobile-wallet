import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Stack } from "expo-router/stack";
import { getHeaderTitle } from "@/utils/getHeaderTitle";
import { NodeSettingsScreen } from "@/features/Dashboard/Settings/Nodes";
import { AppAlert } from "@/features/Dashboard/components/AppAlert";

export default function Screen() {
  const { t } = useTranslation();

  return (
    <Fragment>
      <Stack.Screen options={getHeaderTitle(t("settings.node.title"))} />
      <AppAlert />
      <NodeSettingsScreen />
    </Fragment>
  );
}
