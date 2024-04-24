import { View, Pressable } from "react-native";
import {
  Transaction,
  TransactionArbitrarySubtype,
  TransactionAssetSubtype,
  TransactionEscrowSubtype,
  TransactionLeasingSubtype,
  TransactionMarketplaceSubtype,
  TransactionMiningSubtype,
  TransactionPaymentSubtype,
  TransactionSmartContractSubtype,
  TransactionType,
} from "@signumjs/core";
import { useTranslation } from "react-i18next";
import { useTicker } from "@/hooks/useTicker";
import { Text } from "@/components/Text";
import { formatNumber } from "@/utils/formatNumber";
import Feather from "@expo/vector-icons/Feather";

export const TransactionActivityCard = () => {
  const { t } = useTranslation();
  const { NativeTicker } = useTicker();

  const isReceive = false;

  const pickOptions = () => alert("Options clicked");

  return (
    <Pressable
      onPress={pickOptions}
      className="w-full flex flex-row items-center justify-between gap-2 py-4 ripple-[#333] ripple-bordered"
    >
      <View className="flex flex-row items-center justify-start gap-2 flex-1 w-7/12">
        {isReceive ? (
          <View style={{ transform: [{ rotate: "45deg" }] }}>
            <Feather name="arrow-down-circle" size={28} color="#22C55E" />
          </View>
        ) : (
          <View style={{ transform: [{ rotate: "-135deg" }] }}>
            <Feather name="arrow-down-circle" size={28} color="#EF4444" />
          </View>
        )}

        <View className="flex-1 flex flex-col text-green-500">
          <Text className="font-medium">
            {t(isReceive ? "overview.received" : "overview.sent")}
          </Text>

          <Text size="small" color="muted">
            From distribution to TRT holders
          </Text>

          <Text size="small" color="muted">
            15 hours ago
          </Text>

          <Text size="small" color="muted">
            Confirming...
          </Text>
        </View>
      </View>

      <View className="flex flex-col items-end gap-1 w-5/12">
        <Text
          className="font-bold text-end"
          size="small"
          color={isReceive ? "success" : "error"}
        >
          {`${isReceive ? "+" : "-"} ${formatNumber({ value: 10000000 })} TRT`}
        </Text>
      </View>
    </Pressable>
  );
};
