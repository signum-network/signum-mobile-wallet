import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { CurrencySettingsScreen } from "@/features/Dashboard/Settings/Currency";

export default function Screen() {
  const { t } = useTranslation();

  return (
    <Fragment>
      <CurrencySettingsScreen />
    </Fragment>
  );
}
