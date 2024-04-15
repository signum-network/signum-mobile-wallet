import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Stack } from "expo-router/stack";
import { getHeaderTitle } from "@/utils/getHeaderTitle";
import { CurrencySettingsScreen } from "@/features/Dashboard/Settings/Currency";

export default function Screen() {
  const { t } = useTranslation();

  return (
    <Fragment>
      <Stack.Screen options={getHeaderTitle(t("settings.currency.title"))} />
      <CurrencySettingsScreen />
    </Fragment>
  );
}
