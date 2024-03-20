import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Stack } from "expo-router/stack";
import { getHeaderTitle } from "@/utils/getHeaderTitle";
import { ImportScreen } from "@/features/AccountWizard/Import";

export default function Screen() {
  const { t } = useTranslation();

  return (
    <Fragment>
      <Stack.Screen
        options={getHeaderTitle(t("accountWizard.quickStart.importCta"))}
      />

      <ImportScreen />
    </Fragment>
  );
}
