import { Fragment } from "react";
import { ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/Button";
import { useAccount } from "@/hooks/useAccount";
import { AccountSwitcher } from "@/components/Account/Switcher";
import { BottomButtonsContainer } from "../components/BottomButtonsContainer";
import { DashboardScreenContainer } from "../components/DashboardScreenContainer";
import { Balance } from "./sections/Balance";
import { Activity } from "./sections/Activity";

export const OverviewScreen = () => {
  const { t } = useTranslation();
  const { isWatchOnly } = useAccount();

  return (
    <Fragment>
      <ScrollView>
        <DashboardScreenContainer>
          <View className="flex flex-col items-start justify-center w-full px-4 pt-4 pb-20 gap-4">
            <AccountSwitcher href="/dashboard/account" />

            <Balance />

            <Activity />
          </View>
        </DashboardScreenContainer>
      </ScrollView>

      <BottomButtonsContainer>
        {!isWatchOnly && (
          <Button
            title={t("send")}
            type="primary"
            wide
            linkProps={{ href: "/transfer/send" }}
          />
        )}

        <Button
          title={t("receive")}
          type="blackout"
          wide={!isWatchOnly}
          fullWidth={isWatchOnly}
          linkProps={{ href: "/transfer/receive" }}
        />
      </BottomButtonsContainer>
    </Fragment>
  );
};
