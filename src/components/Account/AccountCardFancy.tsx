import { Dimensions, View, Pressable, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useMemo, useState } from "react";
import { src44 } from "@signumjs/standards";
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
import { Pulse } from "@/components/Puls";
import { asRSAddress } from "@/utils/account/asRSAddress";
import { useAppTheme } from "@/hooks/useAppTheme";
import { toIpfsUrl } from "@/utils/toIpsUrl";
import HashIconNativeSVG from "@/components/Account/Avatar/HashIconNativeSVG";
import { router } from "expo-router";

interface Props {
  publicKey: string;
  type: AccountType;
  walletName: string;
}

const ITEM_HEIGHT = 140;
const WIDTH_SCREEN = Dimensions.get("window").width;

export const AccountCardFancy = ({ publicKey, type, walletName }: Props) => {
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

  //Check if account activation is in progress
  const networkData = currentAccount?.[currentNetwork];
  const activationInProgress = !!networkData?.activationInProgress;

  // Track image loading states
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [avatarLoadError, setAvatarLoadError] = useState(false);
  const [backgroundLoadError, setBackgroundLoadError] = useState(false);

  const images = useMemo(() => {
    if (!currentAccount?.[currentNetwork]?.description) return null;
    try {
      const descriptor = src44.DescriptorData.parse(
        currentAccount[currentNetwork].description,
        false
      );
      // Reset loading and error states when URLs change
      setAvatarLoaded(false);
      setAvatarLoadError(false);
      setBackgroundLoadError(false);
      return {
        avatarUrl: toIpfsUrl(descriptor?.avatar?.ipfsCid) ?? null,
        backgroundUrl: toIpfsUrl(descriptor?.background?.ipfsCid) ?? null,
      };
    } catch {
      return null;
    }
  }, [currentAccount, currentNetwork]);

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
    .activeOffsetX([-20, 20])
    .failOffsetY([-20, 20])
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
      { scale: withTiming(pressed.value ? 1.02 : 1) },
    ],
  }));

  const itemHeightStyle = useAnimatedStyle(() => ({
    height: itemHeight.value,
    marginTop: 14,
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
          assetBalances || [],
          unconfirmedAssetBalances || []
        );
        updateAccountData(publicKey, currentNetwork, {
          loading: false,
          isSecured: true,
          activationInProgress: false,
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
          updateAccountData(publicKey, currentNetwork, {
            loading: false,
            isSecured: false,
            activationInProgress:
              currentAccount?.[currentNetwork]?.activationInProgress ?? false,
            name: "",
            description: "",
            balance: {
              ...currentAccount?.[currentNetwork]?.balance,
            },
            tokenBalance: [],
          });
        }
        return false;
      }
    },
    refetchInterval: PUBLIC_SIGNUM_AVERAGE_BLOCK_TIME_IN_MILLISECONDS,
    staleTime: PUBLIC_SIGNUM_AVERAGE_BLOCK_TIME_IN_MILLISECONDS,
    enabled: isActiveNodeSynced && !!ledgerService,
  });

  const { iconColor, tokens } = useAppTheme();

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={itemHeightStyle}>
        <Animated.View
          className="!rounded-xl pr-4 flex flex-row items-center justify-end"
          style={{
            height: ITEM_HEIGHT,
            position: "absolute",
            right: "0%",
            width: "95%",
            backgroundColor: tokens.error,
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
          className="!rounded-xl overflow-hidden"
          style={[
            transformStyle,
            {
              width: "100%",
              height: ITEM_HEIGHT,
              borderWidth: isCurrentAccount ? 3 : 0,
              borderColor: isCurrentAccount ? tokens.success : "transparent",
            },
          ]}
        >
          <Pressable
            onPress={changeActiveAccount}
            className="w-full h-full relative"
          >
            {/* Background Layer */}
            <View className="absolute inset-0">
              {images?.backgroundUrl && !backgroundLoadError ? (
                <>
                  <Image
                    source={images.backgroundUrl}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    transition={200}
                    onError={() => setBackgroundLoadError(true)}
                    style={{ width: "100%", height: "100%" }}
                  />
                  {/* Dark overlay for text readability */}
                  <View
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      backgroundColor: isCurrentAccount
                        ? "rgba(0,0,0,0.4)"
                        : "rgba(0,0,0,0.5)",
                    }}
                  />
                </>
              ) : (
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: isCurrentAccount
                      ? tokens.primarySoft
                      : tokens.surface,
                  }}
                />
              )}
            </View>

            {/* Active Account Badge */}
            {isCurrentAccount && (
              <View className="absolute top-2 right-2 z-10">
                <View className="bg-white/90 rounded-full px-3 py-1 flex flex-row items-center gap-1 shadow-lg">
                  <Ionicons name="checkmark-circle" size={16} color={tokens.success} />
                  <Text color="success" size="extraSmall" className="font-bold">
                    {t("settings.account.active")}
                  </Text>
                </View>
              </View>
            )}

            {/* Content Layer */}
            <View className="relative w-full h-full p-3 flex flex-row items-center justify-between">
              {/* Left: Avatar and Info */}
              <View className="flex flex-row gap-3 items-center flex-1">
                {/* Large Avatar */}
                <View className="size-20 rounded-full overflow-hidden border-3 border-white/30 shadow-xl bg-white/10">
                  {images?.avatarUrl && !avatarLoadError ? (
                    <>
                      {/* Show HashIcon while loading */}
                      {!avatarLoaded && (
                        <View className="w-full h-full flex items-center justify-center">
                          <HashIconNativeSVG seed={accountId} />
                        </View>
                      )}
                      <Image
                        source={images.avatarUrl}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        transition={200}
                        recyclingKey={accountId}
                        onLoad={() => setAvatarLoaded(true)}
                        onError={() => {
                          setAvatarLoaded(false);
                          setAvatarLoadError(true);
                        }}
                        style={{
                          width: "100%",
                          height: "100%",
                          opacity: avatarLoaded ? 1 : 0,
                          position: avatarLoaded ? "relative" : "absolute",
                        }}
                      />
                    </>
                  ) : (
                    <View className="w-full h-full flex items-center justify-center">
                      <HashIconNativeSVG seed={accountId} />
                    </View>
                  )}
                </View>

                {/* Account Info */}
                <View className="flex flex-col flex-1 gap-0.5">
                  {images?.backgroundUrl && !backgroundLoadError ? (
                    <View className="bg-black/30 rounded-lg px-2 py-1 self-start">
                      <Text
                        color="white"
                        className="font-bold"
                        style={{
                          textShadowColor: 'rgba(0, 0, 0, 0.75)',
                          textShadowOffset: { width: 0, height: 1 },
                          textShadowRadius: 3,
                        }}
                      >
                        {walletName}
                      </Text>
                    </View>
                  ) : (
                    <Text color="content" className="font-bold">
                      {walletName}
                    </Text>
                  )}

                  <Text
                    color={images?.backgroundUrl && !backgroundLoadError ? "white" : "muted"}
                    size="small"
                    style={images?.backgroundUrl && !backgroundLoadError ? {
                      textShadowColor: 'rgba(0, 0, 0, 0.75)',
                      textShadowOffset: { width: 0, height: 1 },
                      textShadowRadius: 3,
                    } : {}}
                  >
                    {asRSAddress(accountId)}
                  </Text>
                  <Text
                    color={images?.backgroundUrl && !backgroundLoadError ? "white" : "muted"}
                    size="small"
                    className="font-bold"
                    style={images?.backgroundUrl && !backgroundLoadError ? {
                      textShadowColor: 'rgba(0, 0, 0, 0.75)',
                      textShadowOffset: { width: 0, height: 1 },
                      textShadowRadius: 3,
                    } : {}}
                  >
                    {formatNumber({ value: availableBalance })} {NativeTicker}
                  </Text>

                  {/* Account Status */}
                  {!isSecured ? (
                    activationInProgress ? (
                      <Pulse>
                        <View className="flex-row items-center gap-1 bg-white/20 rounded-full px-2 py-0.5 self-start mt-0.5">
                          <Ionicons
                            name="hourglass-outline"
                            size={12}
                            color={images?.backgroundUrl && !backgroundLoadError ? "white" : iconColor.primary}
                          />
                          <Text
                            color={images?.backgroundUrl && !backgroundLoadError ? "white" : "primary"}
                            size="extraSmall"
                            className="font-medium"
                          >
                            {t("unsafeAccount.activating")}
                          </Text>
                        </View>
                      </Pulse>
                    ) : (
                      <View className="flex-row items-center gap-1 bg-red-500/80 rounded-full px-2 py-0.5 self-start mt-0.5">
                        <Ionicons name="warning-outline" size={12} color="white" />
                        <Text color="white" size="extraSmall" className="font-medium">
                          {t("settings.account.unsecuredAccount")}
                        </Text>
                      </View>
                    )
                  ) : (
                    <View className="flex-row items-center gap-1 bg-white/20 rounded-full px-2 py-0.5 self-start mt-0.5">
                      <Ionicons
                        name={
                          type === AccountType.watchOnly
                            ? "eye-outline"
                            : "shield-checkmark-outline"
                        }
                        size={12}
                        color={images?.backgroundUrl && !backgroundLoadError ? "white" : iconColor.muted}
                      />
                      <Text
                        color={images?.backgroundUrl && !backgroundLoadError ? "white" : "muted"}
                        size="extraSmall"
                        className="font-medium"
                      >
                        {type === AccountType.watchOnly
                          ? t("watchOnly")
                          : t("fullAccount")}
                      </Text>
                    </View>
                  )}
                </View>

            </View>
                {/* Edit Profile Button */}
                {type === AccountType.mnemonic && isSecured && (
                  <Pressable
                    onPress={() => router.push(`/dashboard/account/${accountId}/profile`)}
                    className="absolute bottom-1 left-5 bg-primary rounded-full px-3 py-1.5 flex-row items-center gap-1 bg-white/20 self-start mt-0.5"
                  >
                    <Ionicons name="create-outline" size={14} color="white" />
                    <Text color="white" size="extraSmall" className="font-medium">
                      {t("profile.edit")}
                    </Text>
                  </Pressable>
                )}
              </View>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};
