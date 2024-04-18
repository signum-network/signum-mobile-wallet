import { Fragment } from "react";
import { ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/Button";
import { AccountSwitcher } from "@/components/Account/Switcher";
import { BottomButtonsContainer } from "../components/BottomButtonsContainer";
import { DashboardScreenContainer } from "../components/DashboardScreenContainer";
import { Balance } from "./sections/Balance";

export const OverviewScreen = () => {
  const { t } = useTranslation();

  return (
    <Fragment>
      <ScrollView>
        <DashboardScreenContainer>
          <View className="flex flex-col items-start justify-center w-full p-4 gap-4">
            <AccountSwitcher href="/dashboard/account" />

            <Balance />
          </View>
        </DashboardScreenContainer>
      </ScrollView>

      <BottomButtonsContainer>
        <Button
          title={t("send")}
          type="primary"
          wide
          linkProps={{ href: "/dashboard/transfer" }}
        />

        <Button
          title={t("receive")}
          type="blackout"
          wide
          linkProps={{ href: "/dashboard/deposit" }}
        />
      </BottomButtonsContainer>
    </Fragment>
  );
};
