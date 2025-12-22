import { Fragment, useMemo, useState, useEffect } from "react";
import { ChainValue } from "@signumjs/util";
import { View } from "react-native";
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
import { PUBLIC_RESERVED_SIGNA_FOR_TX_FEE } from "@/types/constants";
import { SignaSymbol } from "@/components/SignaSymbol";
import { Button } from "@/components/Button";

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
    return balance?.availableBalance?.getSigna
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
  }, [asset, tokenBalance, decimals]);

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
      <View className="w-full gap-4">
        <Card>
          <View className="flex flex-row items-center justify-center gap-3 w-full">
            <AvailableBalanceSummary
              asset={asset}
              isAssetSigna={isAssetSigna}
              readableTicker={readableTicker}
              readableAvailableBalance={Math.max(
                0,
                readableAvailableBalance -
                  (isAssetSigna ? PUBLIC_RESERVED_SIGNA_FOR_TX_FEE : 0)
              )}
            />
          </View>
          {!!tokenBalance.length && (
            <Button
              icon={
                <MaterialIcons
                  name="currency-exchange"
                  size={28}
                  color={iconColor.blackout}
                />
              }
              type="blackout"
              title={t("transfer.changeAsset")}
              size="small"
              fullWidth
              titleClassName="font-medium"
              extraClassNames="mt-2 px-4"
              pressableProps={{
                onPress: showDialog,
                disabled: !tokenBalance.length,
              }}
            />
          )}
          <Text size="medium" color="muted" className="mt-2">
            ({t("reservedBalance")} {PUBLIC_RESERVED_SIGNA_FOR_TX_FEE}{" "}
            <SignaSymbol />)
          </Text>
        </Card>

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
