import { useTranslation } from "react-i18next";
import {
  Alert,
  ActivityIndicator,
  View,
  Pressable,
  AlertButton,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Amount, ChainValue } from "@signumjs/util";
import { useWalletAccount } from "@/hooks/useWalletAccount";
import { useTokenMetadata } from "@/hooks/useTokenMetadata";
import { useTokenTransactionalData } from "@/hooks/useTokenTransactionalData";
import { useActiveMarketRate } from "@/hooks/useActiveMarketRate";
import { TokenAvatar } from "@/components/Token/Avatar";
import { formatNumber } from "@/utils/formatNumber";
import { openTokenLink } from "@/utils/explorer/openLink";
import { Text } from "@/components/Text";
import type { TokenBalance } from "@/types/account";

import * as Clipboard from "expo-clipboard";

export const ITEM_HEIGHT = 70;

export const AssetCard = ({
  asset,
  balanceQNT,
  unconfirmedBalanceQNT,
}: TokenBalance) => {
  const { t } = useTranslation();
  const { accountId, isWatchOnly } = useWalletAccount();
  const { ticker, decimals, account } = useTokenMetadata(asset);
  const { priceNQT, isLoading } = useTokenTransactionalData(asset);
  const { price, ticker: marketTicker } = useActiveMarketRate();

  const isLoadingMetadata = !ticker;
  const isLoadingTransactionalData = isLoading || !price;

  const totalTokenBalance = ChainValue.create(decimals).setAtomic(balanceQNT);

  const availableBalance = ChainValue.create(decimals).setAtomic(
    unconfirmedBalanceQNT
  );

  const reservedBalance = totalTokenBalance.clone().subtract(availableBalance);

  const estimatedSignaValue =
    Number(totalTokenBalance.getCompound()) *
    Number(Amount.fromPlanck(priceNQT).getSigna());

  const estimatedMarketValue =
    estimatedSignaValue && price ? estimatedSignaValue * price : 0;

  const isTokenAdmin = account === accountId;

  const pickOptions = () => {
    const alertOptions: AlertButton[] = [
      {
        text: t("transfer.title"),
        onPress: () => {
          router.push({  pathname: "/dashboard/overview/send",
            params: { asset },
          });
        },
      },
      {
        text: t("overview.tokens.copyTokenId"),
        onPress: async () => {
          await Clipboard.setStringAsync(asset);
          alert(t("overview.tokens.copiedTokenId"));
        },
      },
      {
        text: t("overview.viewInExplorer"),
        onPress: () => {
          openTokenLink(asset);
        },
      },
    ];

    if (isWatchOnly) alertOptions.shift();

    // Add cancel button (only visible on iOS)
    if (Platform.OS === "ios") {
      alertOptions.push({
        text: t("cancel"),
        style: "cancel",
        onPress: () => {},
      });
    }

    Alert.alert(
      `(${ticker}) ${t("overview.options")}`,
      `${t("overview.description")}\n\n${t("availableBalance")}: ${formatNumber(
        {
          value: availableBalance.getCompound(),
          maximumFractionDigits: decimals,
        }
      )}\n${t("reservedBalance")}: ${formatNumber({
        value: reservedBalance.getCompound(),
        maximumFractionDigits: decimals,
      })}`,
      alertOptions,
      {
        cancelable: true,
      }
    );
  };

  return (
    <Pressable
      onPress={pickOptions}
      className="w-full flex flex-row items-center justify-between gap-2 py-4 ripple-[#333] ripple-bordered"
    >
      <View className="flex flex-row items-center justify-start gap-2 flex-1 w-6/12">
        <TokenAvatar tokenId={asset}/>

        <View className="flex-1 flex items-start flex-col gap-1">
          {isLoadingMetadata ? (
            <ActivityIndicator size={18} />
          ) : (
            <>
              <View className="flex flex-row items-center gap-1">
                <Text className="font-medium">{ticker}</Text>

                {isTokenAdmin && (
                  <Text size="extraSmall" color="success">
                    ✅ {t("overview.tokens.admin")}
                  </Text>
                )}
              </View>

              <Text className="font-medium" color="muted">
                {formatNumber({
                  value: totalTokenBalance.getCompound(),
                  maximumFractionDigits: decimals,
                })}
              </Text>
            </>
          )}
        </View>
      </View>

      <View className="flex flex-col items-end gap-1 w-6/12">
        {isLoadingTransactionalData ? (
          <ActivityIndicator size={18} />
        ) : (
          <>
            <Text className="font-medium">
              {formatNumber({
                value: estimatedSignaValue,
              })}
            </Text>

            {!!estimatedSignaValue && (
              <Text size="small" color="muted">
                {`≈ ${marketTicker} ${formatNumber({
                  value: estimatedMarketValue,
                  isFiat: true,
                })}`}
              </Text>
            )}
          </>
        )}
      </View>
    </Pressable>
  );
};
