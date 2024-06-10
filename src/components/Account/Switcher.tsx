import { View, Pressable } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAccount } from "@/hooks/useAccount";
import { useAccountStore } from "@/hooks/useAccountStore";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { asRSAddress } from "@/utils/account/asRSAddress";
import { NoAccountsFoundCard } from "./NoAccountsFoundCard";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

interface Props {
  href: "/dashboard/settings/account" | "/dashboard/account";
}

export const AccountSwitcher = ({ href }: Props) => {
  const { t } = useTranslation();
  const { iconColor } = useAppTheme();
  const { accountId, isWatchOnly, walletName } = useAccount();
  const { accountPublicKeys } = useAccountStore();

  const goToAccountSettings = () => {
    href === "/dashboard/account" ? router.replace(href) : router.push(href);
  };

  if (!accountPublicKeys.length) return <NoAccountsFoundCard />;

  return (
    <Pressable
      onPress={goToAccountSettings}
      className="w-full rounded-lg active:opacity-80 ripple-[#333] ripple-bordered"
    >
      <Card>
        <View className="w-full flex flex-row justify-between items-center">
          <View className="flex flex-row gap-2 items-center justify-start flex-1">
            {/* TODO: Show account avatar */}
            {/* <View className="w-10 h-10 bg-slate-300 rounded-lg"></View> */}

            <View className="flex flex-col">
              <Text className="font-medium">{walletName}</Text>
              <Text color="muted">{asRSAddress(accountId)}</Text>

              {isWatchOnly && (
                <Text color="primary" size="small">
                  🕵️ {t("watchOnly")}
                </Text>
              )}
            </View>
          </View>

          <View className="border rounded-lg border-card-border dark:border-card-border-dark p-4 opacity-80">
            <FontAwesome6
              name="arrows-rotate"
              size={28}
              color={iconColor.default}
            />
          </View>
        </View>
      </Card>
    </Pressable>
  );
};
