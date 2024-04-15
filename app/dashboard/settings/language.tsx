import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Stack } from "expo-router/stack";
import { getHeaderTitle } from "@/utils/getHeaderTitle";
import { LanguageSettingsScreen } from "@/features/Dashboard/Settings/Language";

export default function Screen() {
  const { t } = useTranslation();

  return (
    <Fragment>
      <Stack.Screen options={getHeaderTitle(t("settings.language.title"))} />
      <LanguageSettingsScreen />
    </Fragment>
  );
}
