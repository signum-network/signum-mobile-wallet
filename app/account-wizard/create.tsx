import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Stack } from "expo-router/stack";
import { getHeaderTitle } from "@/utils/getHeaderTitle";
import { CreateScreen } from "@/features/AccountWizard/Create";

export default function Screen() {
  const { t } = useTranslation();

  return (
    <Fragment>
      <Stack.Screen
        options={getHeaderTitle(t("accountWizard.createAccount.headerTitle"))}
      />

      <CreateScreen />
    </Fragment>
  );
}
