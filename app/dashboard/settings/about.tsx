import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { AboutScreen } from "@/features/Dashboard/Settings/About";

export default function Screen() {
  const { t } = useTranslation();

  return (
    <Fragment>
      <AboutScreen />
    </Fragment>
  );
}
