import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { NodeSettingsScreen } from "@/features/Dashboard/Settings/Nodes";
import { AppAlert } from "@/features/Dashboard/components/AppAlert";

export default function Screen() {
  const { t } = useTranslation();

  return (
    <Fragment>
      <AppAlert />
      <NodeSettingsScreen />
    </Fragment>
  );
}
