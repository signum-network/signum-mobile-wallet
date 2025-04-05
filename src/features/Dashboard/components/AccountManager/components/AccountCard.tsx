import { Dimensions, View, Pressable, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Address } from "@signumjs/core";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Text } from "@/components/Text";
import { AccountAvatar } from "@/components/Account/Avatar";
import { useTicker } from "@/hooks/useTicker";
import { useAccountStore } from "@/hooks/useAccountStore";
import { AccountType } from "@/types/account";
import { deleteSecretKey } from "@/utils/sec/handleSecretKeys";
import { formatNumber } from "@/utils/formatNumber";
import { useLedgerService } from "@/hooks/useLedgerService";
import { getBalancesFromAccount } from "@/utils/account/getBalancesFromAccount";
import { getTokenBalancesFromAccount } from "@/utils/account/getTokenBalancesFromAccount";
import { PUBLIC_SIGNUM_AVERAGE_BLOCK_TIME_IN_MILLISECONDS } from "@/types/constants";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Props {
  publicKey: string;
  type: AccountType;
  walletName: string;
}

export const ITEM_HEIGHT = 90;
const WIDTH_SCREEN = Dimensions.get("window").width;

export const AccountCard = ({ publicKey, type, walletName }: Props) => {
  const { t } = useTranslation();
  const { ledgerService } = useLedgerService();
  const { NativeTicker } = useTicker();
  const { isTestnet, isActiveNodeSynced, currentNetwork } = useNodeHostStore();
  const {
    activeAccount,
    setActiveAccount,
    deleteAccount,
    accounts,
    accountPublicKeys,
    updateAccountData,
    updateAccountActivationStatus,
  } = useAccountStore();

  const currentAccount = accounts[publicKey];
  const accountId = Address.fromPublicKey(publicKey).getNumericId();

  const isMainnetSecured = currentAccount
    ? currentAccount.mainnet.isSecured
    : undefined;

  const isTestnetSecured = currentAccount
    ? currentAccount.testnet.isSecured
    : undefined;

  const mainnetBalance = currentAccount
    ? currentAccount.mainnet.balance
    : undefined;

  const testnetBalance = currentAccount
    ? currentAccount.testnet.balance
    : undefined;

  // Check if account is secured on designated network (Mainnet or Testnet)
  const isSecured =
    (isMainnetSecured && !isTestnet) || (isTestnetSecured && isTestnet);

  let availableBalance = "0";

  if (isTestnet && testnetBalance?.totalBalance?.getSigna) {
    availableBalance = testnetBalance?.totalBalance?.getSigna();
  }

  if (!isTestnet && mainnetBalance?.totalBalance?.getSigna) {
    availableBalance = mainnetBalance?.totalBalance?.getSigna();
  }

  const pressed = useSharedValue(false);
  const itemHeight = useSharedValue(ITEM_HEIGHT);
  const swipeTranslateX = useSharedValue(0);

  const isCurrentAccount = activeAccount === publicKey;

  // TODO: Remove "transactions history", "subscription" from account
  const removeAccount = async () => {
    itemHeight.set(0);

    if (isCurrentAccount) {
      const newAccountPublicKeys = accountPublicKeys.filter(
        (key) => publicKey != key
      );
      setActiveAccount(newAccountPublicKeys[0] ?? "");
    }

    await deleteSecretKey(publicKey);

    deleteAccount(publicKey);

    alert(t("settings.account.accountRemoved"));
  };

  const requestDelete = () => {
    Alert.alert(
      t("settings.account.removeAccount"),
      t(
        type === AccountType.mnemonic
          ? "settings.account.removeFullAccountDescription"
          : "settings.account.removeWatchOnlyAccountDescription",
        { walletName }
      ),
      [
        {
          text: t("cancel"),
          style: "cancel",
        },
        {
          text: t("settings.account.confirm"),
          onPress: removeAccount,
          style: "destructive",
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  const changeActiveAccount = () => {
    if (isCurrentAccount) return;
    setActiveAccount(publicKey);
  };

  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.set(true);
    })
    .onChange((event) => {
      if (event.translationX < 0) {
        swipeTranslateX.set(event.translationX);
      }
    })
    .onFinalize(() => {
      const isShouldDismiss = swipeTranslateX.value < -WIDTH_SCREEN * 0.5;

      if (isShouldDismiss) {
        swipeTranslateX.set(
          withTiming(0, undefined, (isDone) => {
            if (isDone) {
              runOnJS(requestDelete)();
            }
          })
        );
      } else {
        swipeTranslateX.set(withSpring(0));
      }
      pressed.set(false);
    });

  const transformStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: swipeTranslateX.value },
      { scale: withTiming(pressed.value ? 1.05 : 1) },
    ],
  }));

  const itemHeightStyle = useAnimatedStyle(() => ({
    height: itemHeight.value,
    marginTop: 32,
  }));

  useQuery({
    queryKey: ["fetchAccountData", publicKey, currentNetwork],
    queryFn: async () => {
      if (!ledgerService) return;

      try {
        const {
          name,
          description,
          balanceNQT,
          unconfirmedBalanceNQT,
          committedBalanceNQT,
          assetBalances,
          unconfirmedAssetBalances,
        } = await ledgerService.account.fetchAccount(accountId, true);

        const balance = getBalancesFromAccount(
          balanceNQT,
          unconfirmedBalanceNQT,
          committedBalanceNQT
        );

        const tokenBalance = getTokenBalancesFromAccount(
          assetBalances,
          unconfirmedAssetBalances
        );

        updateAccountData(publicKey, currentNetwork, {
          loading: false,
          isSecured: true,
          name: name || "",
          description: description || "",
          balance,
          tokenBalance,
        });

        return true;
      } catch (error: any) {
        if (
          error.message === "incorrectAccount" ||
          error.message === "unknownAccount"
        ) {
          updateAccountActivationStatus(publicKey, currentNetwork, false);
        }

        return false;
      }
    },
    refetchInterval: PUBLIC_SIGNUM_AVERAGE_BLOCK_TIME_IN_MILLISECONDS,
    staleTime: PUBLIC_SIGNUM_AVERAGE_BLOCK_TIME_IN_MILLISECONDS,
    enabled: isActiveNodeSynced && !!ledgerService,
  });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={itemHeightStyle}>
        <Animated.View
          className="bg-red-500 !rounded-lg pr-4 flex flex-row items-center justify-end"
          style={{
            height: ITEM_HEIGHT,
            position: "absolute",
            right: "0%",
            width: "95%",
          }}
        >
          <View className="flex flex-row items-center gap-2">
            <Text color="white" className="font-bold">
              {t("settings.account.deleteAccount")}
            </Text>

            <Ionicons name="trash-bin" size={24} color="white" />
          </View>
        </Animated.View>

        <Animated.View
          className="bg-card-foreground dark:bg-card-foreground-dark border border-card-border dark:border-card-border-dark !rounded-lg"
          style={[
            transformStyle,
            {
              width: "100%",
              height: ITEM_HEIGHT,
            },
          ]}
        >
          <Pressable
            onPress={changeActiveAccount}
            className="flex flex-row items-center justify-between p-4 ripple-[#333] ripple-bordered !rounded-lg w-full"
          >
            <View className="flex flex-row gap-4 items-center justify-start flex-1">
              <AccountAvatar
                loading={!isSecured}
                accountId={accountId}
                description={currentAccount[currentNetwork].description}
              />

              <View className="flex flex-col gap-1">
                <Text className="font-bold">{walletName}</Text>

                <Text color="muted" className="font-bold">
                  {formatNumber({ value: availableBalance })} {NativeTicker}
                </Text>

                {!isSecured ? (
                  <Text color="error" size="small" className="font-medium">
                    ⚠️ {t("settings.account.unsecuredAccount")}
                  </Text>
                ) : (
                  <Text color="primary" size="small" className="font-medium">
                    {type === AccountType.watchOnly
                      ? `🕵️ ${t("watchOnly")}`
                      : `🤖 ${t("fullAccount")}`}
                  </Text>
                )}
              </View>
            </View>

            {isCurrentAccount && (
              <View className="flex flex-col items-center justify-center">
                <Ionicons name="checkbox" size={36} color="green" />

                <Text color="success" className="font-bold" size="small">
                  {t("settings.account.active")}
                </Text>
              </View>
            )}
          </Pressable>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};
