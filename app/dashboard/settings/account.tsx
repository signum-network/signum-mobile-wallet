import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Stack } from "expo-router/stack";
import { getHeaderTitle } from "@/utils/getHeaderTitle";
import { AccountSettingsScreen } from "@/features/Dashboard/Settings/Account";

export default function Screen() {
  const { t } = useTranslation();

  return (
    <Fragment>
      <Stack.Screen options={getHeaderTitle(t("settings.account.title"))} />
      <AccountSettingsScreen />
    </Fragment>
  );
}
