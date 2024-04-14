import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Stack } from "expo-router/stack";
import { getHeaderTitle } from "@/utils/getHeaderTitle";
import { CreateScreen } from "@/features/AccountWizard/Create";
import { AppAlert } from "@/features/Dashboard/components/AppAlert";

export default function Screen() {
  const { t } = useTranslation();

  return (
    <Fragment>
      <Stack.Screen
        options={getHeaderTitle(t("accountWizard.quickStart.createCta"))}
      />
      <AppAlert />
      <CreateScreen />
    </Fragment>
  );
}
