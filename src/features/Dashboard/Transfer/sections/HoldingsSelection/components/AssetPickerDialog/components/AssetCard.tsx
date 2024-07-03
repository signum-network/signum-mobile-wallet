import { View, Pressable } from "react-native";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ChainValue } from "@signumjs/util";
import { useTokenMetadata } from "@/hooks/useTokenMetadata";
import { useTicker } from "@/hooks/useTicker";
import { formatNumber } from "@/utils/formatNumber";
import { Text } from "@/components/Text";
import type { TokenBalance } from "@/types/account";
import type { TransactionCreation } from "../../../../../utils/types";

export const ITEM_HEIGHT = 70;

interface Props extends TokenBalance {
  isSigna?: boolean;
  signaAvailableBalance?: number;
}

export const AssetCard = ({
  asset,
  unconfirmedBalanceQNT,
  isSigna,
  signaAvailableBalance,
}: Props) => {
  const { t } = useTranslation();
  const { NativeTicker } = useTicker();
  const { ticker: tokenTicker, decimals } = useTokenMetadata(asset);
  const { watch, setValue } = useFormContext<TransactionCreation>();

  const formAsset = watch("asset");

  const availableTokenBalance = !isSigna
    ? Number(
        ChainValue.create(decimals)
          .setAtomic(unconfirmedBalanceQNT)
          .getCompound()
      )
    : 0;

  const readableTicker = isSigna ? NativeTicker : tokenTicker;
  const readableBalance = isSigna
    ? signaAvailableBalance
    : availableTokenBalance;
  const readableDecimals = !isSigna ? decimals : undefined;

  const changeAsset = () => {
    if (!readableBalance) return;

    setValue("amount", 0);
    setValue("maxAmount", readableBalance || 0);
    setValue("asset", asset || "0");
  };

  const isPicked = formAsset === asset || (isSigna && formAsset === "0");

  return (
    <Pressable
      onPress={changeAsset}
      className="w-full flex flex-row items-center justify-between gap-2 py-4 ripple-[#333] ripple-bordered"
    >
      <View className="flex flex-row items-center justify-start gap-2 flex-1 w-6/12">
        {/* TODO: Show asset avatar (SIGNA or Token) */}
        {/* <View className="w-10 h-10 bg-slate-300 rounded-lg"></View> */}

        <View className="flex flex-col">
          <Text className="font-medium">{readableTicker}</Text>

          {isPicked && (
            <Text size="extraSmall" className="font-medium" color="success">
              {t("transfer.picked")} ✅
            </Text>
          )}
        </View>
      </View>

      <View className="flex flex-col items-end gap-1 w-6/12">
        <Text className="font-medium">
          {formatNumber({
            value: readableBalance,
            maximumFractionDigits: readableDecimals,
          })}
        </Text>

        <Text size="extraSmall" className="font-medium" color="muted">
          Available {readableTicker}
        </Text>
      </View>
    </Pressable>
  );
};
