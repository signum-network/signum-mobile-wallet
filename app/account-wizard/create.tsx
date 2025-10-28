import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { CreateScreen } from "@/features/AccountWizard/Create";
import { AppAlert } from "@/features/Dashboard/components/AppAlert";

export default function Screen() {
  const { t } = useTranslation();

  return (
    <Fragment>
      <AppAlert />
      <CreateScreen />
    </Fragment>
  );
}
