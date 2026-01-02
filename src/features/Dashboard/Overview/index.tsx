import { Fragment } from "react";
import { ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/Button";
import { useWalletAccount } from "@/hooks/useWalletAccount";
import { BottomButtonsContainer } from "../components/BottomButtonsContainer";
import { DashboardScreenContainer } from "../components/DashboardScreenContainer";
import { Balance } from "./sections/Balance";
import { Activity } from "./sections/Activity";
import { HorizontalDivider } from "@/components/HorizontalDivider";
import {AccountSwitcherFancy} from "@/components/Account/SwitcherFancy";

export const OverviewScreen = () => {
  const { t } = useTranslation();
  const { isWatchOnly } = useWalletAccount();

  return (
    <Fragment>
      <DashboardScreenContainer>
        <View className="flex flex-col items-start justify-center w-full px-4 pt-4 gap-4">
           <AccountSwitcherFancy href="/dashboard/account" />
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
            linkProps={{ href: "/dashboard/overview/send?asset=0" }}
            extraClassNames="h-14 min-w-0 flex-1 px-2"
          />
        )}

      <Button
          key={`receive-${isWatchOnly ? 'single' : 'double'}`}
          title={t("receive")}
          type="blackout"
          size="medium"
          fullWidth={isWatchOnly}
          linkProps={{ href: "/dashboard/overview/receive" }}
          extraClassNames={`h-14 min-w-0 px-2 ${isWatchOnly ? "w-full" : "flex-1"}`}
        />
      </BottomButtonsContainer>
    </Fragment>
  );
};
