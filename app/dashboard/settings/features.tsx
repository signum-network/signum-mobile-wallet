import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Stack } from "expo-router/stack";
import { getHeaderTitle } from "@/utils/getHeaderTitle";
import { FeaturesSettingsScreen } from "@/features/Dashboard/Settings/Features";

export default function Screen() {
  const { t } = useTranslation();

  return (
    <Fragment>
      <Stack.Screen options={getHeaderTitle(t("settings.features.title"))} />
      <FeaturesSettingsScreen />
    </Fragment>
  );
}
