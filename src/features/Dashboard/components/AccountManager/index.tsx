import { Fragment, useRef, type RefObject } from "react";
import { ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";
import { FlashList } from "@shopify/flash-list";
import { useAccountStore } from "@/hooks/useAccountStore";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { NoAccountsFoundCard } from "@/components/Account/NoAccountsFoundCard";
import { BottomButtonsContainer } from "../../components/BottomButtonsContainer";
import { DashboardScreenContainer } from "../../components/DashboardScreenContainer";
import { AccountCard, ITEM_HEIGHT } from "./components/AccountCard";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export const AccountManager = () => {
  const { t } = useTranslation();
  const { accounts } = useAccountStore();
  const { iconColor } = useAppTheme();

  const scrollRef: RefObject<ScrollView> = useRef(null!);

  const accountsList = Object.values(accounts);

  return (

    <Fragment>
      <ScrollView ref={scrollRef} className="flex-1">
        <DashboardScreenContainer>
          <View className="flex flex-col items-start justify-center w-full px-4">
            <View className="w-full flex flex-col items-start justify-start mt-8 gap-2">

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

            <View
              style={{
                flex: 1,
                flexGrow: 1,
                minHeight: 500,
                width: "100%",
                paddingBottom: 200,
              }}
            >
              <FlashList
                data={accountsList}
                keyExtractor={({ publicKey }) => publicKey}
                renderItem={({ item }) => <AccountCard {...item} />}
                estimatedItemSize={ITEM_HEIGHT}
                ListEmptyComponent={<NoAccountsFoundCard />}
              />
            </View>
          </View>
        </DashboardScreenContainer>
      </ScrollView>

      <BottomButtonsContainer>
        <Button
          title={t("accountWizard.quickStart.createCta")}
          type="primary"
          size="medium"
          linkProps={{ href: "/account-wizard/create" }}
          extraClassNames="h-14 flex-1 min-w-0 px-2"
        />

        <Button
          title={t("accountWizard.quickStart.importCta")}
          type="blackout"
          size="small"
          linkProps={{ href: "/account-wizard/import" }}
          extraClassNames="h-14 flex-1 min-w-0 px-2"
        />
      </BottomButtonsContainer>
    </Fragment>

  );
};
