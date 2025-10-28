import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { ImportScreen } from "@/features/AccountWizard/Import";
import { AppAlert } from "@/features/Dashboard/components/AppAlert";

export default function Screen() {
  const { t } = useTranslation();

  return (
    <Fragment>
      <AppAlert />
      <ImportScreen />
    </Fragment>
  );
}
