import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Stack } from "expo-router/stack";
import { getHeaderTitle } from "@/utils/getHeaderTitle";
import { ProtectedScreen } from "@/features/Dashboard/components/ProtectedScreen";
import { ActivityScreen } from "@/features/Dashboard/Overview/Activity";

export default function Screen() {
  const { t } = useTranslation();

  return (
    <Fragment>
      <ProtectedScreen>
        <ActivityScreen />
      </ProtectedScreen>
    </Fragment>
  );
}
