import { Fragment, useMemo, useState, useEffect } from "react";
import { ChainValue } from "@signumjs/util";
import { View, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { useTokenMetadata } from "@/hooks/useTokenMetadata";
import { useAccount } from "@/hooks/useAccount";
import { useTicker } from "@/hooks/useTicker";
import { useAppTheme } from "@/hooks/useAppTheme";
import type { TransactionCreation } from "../../utils/types";
import { AvailableBalanceSummary } from "./components/AvailableBalanceSummary";
import { AssetPickerDialog } from "./components/AssetPickerDialog";
import { AmountBox } from "./components/AmountBox";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export const HoldingsSelection = () => {
  const { t } = useTranslation();
  const { iconColor } = useAppTheme();
  const { NativeTicker } = useTicker();
  const {
    accountData: { balance, tokenBalance },
  } = useAccount();
  const { watch, setValue } = useFormContext<TransactionCreation>();

  const asset = watch("asset");
  const { ticker: tokenTicker, decimals } = useTokenMetadata(asset);

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const showDialog = () => setIsDialogVisible(true);
  const hideDialog = () => setIsDialogVisible(false);

  const isAssetSigna = asset === "0";

  const signaAvailableBalance = useMemo(() => {
    return balance && balance?.availableBalance?.getSigna
      ? Number(balance?.availableBalance?.getSigna())
      : 0;
  }, [balance]);

  const tokenAvailableBalance = useMemo(() => {
    const currentTokenBalance = tokenBalance.find(
      (token) => token.asset === asset
    );

    return asset !== "0" && currentTokenBalance
      ? Number(
          ChainValue.create(decimals)
            .setAtomic(currentTokenBalance.unconfirmedBalanceQNT)
            .getCompound()
        )
      : 0;
  }, [tokenBalance, decimals]);

  useEffect(() => {
    hideDialog();
  }, [asset]);

  useEffect(() => {
    if (isAssetSigna) {
      setValue("maxAmount", signaAvailableBalance);
    } else {
      setValue("maxAmount", tokenAvailableBalance);
      setValue("assetDecimals", decimals);
    }
  }, [isAssetSigna, signaAvailableBalance, tokenAvailableBalance, decimals]);

  const readableTicker = isAssetSigna ? NativeTicker : tokenTicker;

  const readableAvailableBalance = isAssetSigna
    ? signaAvailableBalance
    : tokenAvailableBalance;

  return (
    <Fragment>
      <View className="gap-4 w-full">
        <Pressable
          onPress={showDialog}
          disabled={!tokenBalance.length}
          className="w-full rounded-lg active:opacity-80 ripple-[#333] ripple-bordered"
        >
          <Card>
            <View className="w-full flex flex-row justify-between items-center">
              <AvailableBalanceSummary
                readableTicker={readableTicker}
                readableAvailableBalance={readableAvailableBalance}
              />

              <View className="border rounded-lg border-card-border dark:border-card-border-dark px-2 py-4 opacity-80 flex flex-col items-center gap-1">
                <MaterialIcons
                  name="currency-exchange"
                  size={28}
                  color={iconColor.primary}
                />

                <Text size="extraSmall" color="primary">
                  {t("transfer.changeAsset")}
                </Text>
              </View>
            </View>
          </Card>
        </Pressable>

        <AmountBox />
      </View>

      <AssetPickerDialog
        visible={isDialogVisible}
        onClose={hideDialog}
        signaAvailableBalance={signaAvailableBalance}
      />
    </Fragment>
  );
};
