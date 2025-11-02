import { Fragment } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { FlashList } from "@shopify/flash-list";
import { useAccountStore } from "@/hooks/useAccountStore";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { NoAccountsFoundCard } from "@/components/Account/NoAccountsFoundCard";
import { BottomButtonsContainer } from "../../components/BottomButtonsContainer";
import { DashboardScreenContainer } from "../../components/DashboardScreenContainer";
import { AccountCard } from "./components/AccountCard";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HorizontalDivider } from "@/components/HorizontalDivider";

export const AccountManager = () => {
  const { t } = useTranslation();
  const { accounts } = useAccountStore();
  const { iconColor } = useAppTheme();
  const insets = useSafeAreaInsets();

  const accountsList = Object.values(accounts).sort(
    (a, b) => b.addedAt - a.addedAt
  );

  if (!accountsList.length) {
    return (
      <DashboardScreenContainer>
        <View className="flex-1 w-full justify-center items-center px-4">
          <NoAccountsFoundCard />
        </View>
      </DashboardScreenContainer>
    );
  }

  return (
    <Fragment>
      <DashboardScreenContainer>
        <View className="flex-1 flex-col items-start justify-center w-full px-4">
          <View className="w-full flex flex-col items-start justify-start mt-8 gap-2 pb-4">
            <View className="flex flex-row items-center gap-1">
              <MaterialIcons
                name="swipe-left"
                size={18}
                color={iconColor.default}
                className="opacity-80"
              />

              <Text
                size="small"
                color="muted"
                className="font-bold text-center"
              >
                {t("settings.account.swipeToLeft")}
              </Text>
            </View>
          </View>
          <HorizontalDivider />
          <View className="w-full flex-1">
            <FlashList
              key={accountsList.length}   
              data={accountsList}
              keyExtractor={({ publicKey }) => publicKey}
              renderItem={({ item }) => <AccountCard {...item} />}
              contentContainerStyle={{ paddingBottom: insets.bottom + 60 }}
            />
          </View>
        </View>
      </DashboardScreenContainer>
      <BottomButtonsContainer>
        <Button
          title={t("accountWizard.quickStart.createCta")}
          type="primary"
          size="medium"
          linkProps={{ href: "/dashboard/account/create" }}
          extraClassNames="h-14 flex-1 min-w-0 px-2"
        />

        <Button
          title={t("accountWizard.quickStart.importCta")}
          type="blackout"
          size="medium"
          linkProps={{ href: "/dashboard/account/import" }}
          extraClassNames="h-14 flex-1 min-w-0 px-2"
        />
      </BottomButtonsContainer>
    </Fragment>
  );
};
