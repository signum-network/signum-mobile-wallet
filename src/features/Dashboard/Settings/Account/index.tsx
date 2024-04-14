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
import { SettingScreenContainer } from "../components/SettingScreenContainer";
import { AccountCard, ITEM_HEIGHT } from "./components/AccountCard";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export const AccountSettingsScreen = () => {
  const { t } = useTranslation();
  const { accounts } = useAccountStore();
  const { iconColor } = useAppTheme();

  const scrollRef: RefObject<ScrollView> = useRef(null);

  const accountsList = Object.values(accounts);

  return (
    <Fragment>
      <ScrollView ref={scrollRef} className="flex-1">
        <SettingScreenContainer>
          <View className="flex flex-col items-start justify-center w-full px-4">
            <View className="w-full flex flex-col items-start justify-start mt-8 gap-2">
              <Text size="large" className="font-bold text-center">
                {t("accounts")}
              </Text>

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
        </SettingScreenContainer>
      </ScrollView>

      <BottomButtonsContainer>
        <Button
          title={t("accountWizard.quickStart.createCta")}
          type="primary"
          size="small"
          linkProps={{ href: "/account-wizard/create" }}
        />

        <Button
          title={t("accountWizard.quickStart.importCta")}
          type="blackout"
          size="small"
          linkProps={{ href: "/account-wizard/import" }}
        />
      </BottomButtonsContainer>
    </Fragment>
  );
};
