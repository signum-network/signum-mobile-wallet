import { View, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { marketStore } from "@/states/marketStore";
import {
  AllowedTickersSymbol,
  type SupportedTickerSymbol,
} from "@/types/currencies";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Props {
  id: SupportedTickerSymbol;
}

export const CurrencyCard = ({ id }: Props) => {
  const { t } = useTranslation();
  const activeCurrency = marketStore((state) => state.activeCurrency);
  const setActiveCurrency = marketStore((state) => state.setActiveCurrency);

  const changeActiveCurrency = () => {
    setActiveCurrency(id);
  };

  const isCurrentCurrency = activeCurrency === id;

  const symbol = AllowedTickersSymbol.get(id);

  return (
    <Pressable
      onPress={changeActiveCurrency}
      className="w-full rounded-lg active:opacity-80 ripple-[#333] ripple-bordered"
    >
      <Card>
        <View className="h-12 w-full flex flex-row justify-between items-center">
          <View className="flex flex-row gap-1 items-center justify-start">
            <Text className="font-medium" size="large">
              {id.toUpperCase()}
            </Text>

            <Text color="muted" size="large">
              {symbol}
            </Text>
          </View>

          {isCurrentCurrency && (
            <View className="w-20 flex flex-col items-center justify-center">
              <Ionicons name="checkbox" size={24} color="green" />

              <Text color="success" className="font-bold" size="small">
                {t("settings.account.active")}
              </Text>
            </View>
          )}
        </View>
      </Card>
    </Pressable>
  );
};
