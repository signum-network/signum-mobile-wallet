import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { AccountManager } from "@/features/Dashboard/components/AccountManager";
import { AppAlert } from "@/features/Dashboard/components/AppAlert";

export default function Screen() {
  const { t } = useTranslation();

  return (
    <Fragment>
      <AppAlert />
      <AccountManager />
    </Fragment>
  );
}
