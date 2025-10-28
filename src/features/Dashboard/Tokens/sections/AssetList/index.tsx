import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { FlashList } from "@shopify/flash-list";
import { Card } from "@/components/Card";
import { useTicker } from "@/hooks/useTicker";
import { Text } from "@/components/Text";
import type { TokenBalance } from "@/types/account";
import { NoTokensFoundCard } from "@/components/Account/NoTokensFoundCard";
import { AssetCard, ITEM_HEIGHT } from "./components/AssetCard";

interface Props {
  list: TokenBalance[];
}

export const AssetList = ({ list }: Props) => {
  const { t } = useTranslation();
  const { NativeTicker } = useTicker();

  return (
    <Card>
      {!!list.length && (
        <View className="w-full flex flex-row items-center justify-between">
          <Text color="muted" className="font-medium">
            {t("coin")}
          </Text>

          <Text color="muted" className="font-medium">
            {`${t("estimatedValue")} (${NativeTicker})`}
          </Text>
        </View>
      )}

      <View
        style={{
          flex: 1,
          flexGrow: 1,
          minHeight: ITEM_HEIGHT,
          width: "100%",
        }}
      >
        <FlashList
          data={list}
          keyExtractor={({ asset }) => asset}
          renderItem={({ item }) => <AssetCard {...item} />}
          ListEmptyComponent={<NoTokensFoundCard />}
        />
      </View>
    </Card>
  );
};
