import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Tabs } from "expo-router/tabs";
import { Text } from "@/components/Text";
import { ProtectedScreen } from "@/features/Dashboard/components/ProtectedScreen";
import { getHeaderTitle } from "@/utils/getHeaderTitle";

export default function Screen() {
  const { t } = useTranslation();

  return (
    <Fragment>
      <Tabs.Screen options={getHeaderTitle(t("transaction_other"))} />
      <ProtectedScreen>
        <Text>Account Activity Screen</Text>
      </ProtectedScreen>
    </Fragment>
  );
}
