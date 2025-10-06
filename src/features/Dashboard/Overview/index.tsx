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
import { HorizontalDivider } from "@/components/HorizontalDivider";

export const OverviewScreen = () => {
  const { t } = useTranslation();
  const { isWatchOnly } = useAccount();

  return (
    <Fragment>
      <DashboardScreenContainer>
        <View className="flex flex-col items-start justify-center w-full px-4 pt-4 gap-4">
          <AccountSwitcher href="/dashboard/account" />

          <Balance />
          <HorizontalDivider />
          <ScrollView className="w-full">
            <Activity />
          </ScrollView>
        </View>
      </DashboardScreenContainer>

      <BottomButtonsContainer>
        {!isWatchOnly && (
          <Button
            title={t("send")}
            type="primary"
            size="medium"
            wide
            linkProps={{ href: "/transfer/send" }}
            extraClassNames="h-14 flex-1 px-2"
          />
        )}

      <Button
          key={`receive-${isWatchOnly ? 'single' : 'double'}`}
          title={t("receive")}
          type="blackout"
          size="medium"
          wide={!isWatchOnly}
          fullWidth={isWatchOnly}
          linkProps={{ href: "/transfer/receive" }}
          extraClassNames={`h-14 px-2 ${isWatchOnly ? "w-full" : "flex-1"}`}
        />
      </BottomButtonsContainer>
    </Fragment>
  );
};
