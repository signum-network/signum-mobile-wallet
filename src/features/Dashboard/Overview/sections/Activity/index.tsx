import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { type Transaction } from "@signumjs/core";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { useAccount } from "@/hooks/useAccount";
import { NoAccountsFoundCard } from "@/components/Account/NoAccountsFoundCard";
import {
  TransactionActivityCard,
  ITEM_HEIGHT,
} from "../../components/TransactionActivityCard";

import dummyData from "./utils/dummy-transactions.json";

export const Activity = () => {
  const { t } = useTranslation();

  // @ts-ignore
  const transactions: Transaction[] = dummyData.transactions;

  return (
    <Card>
      <Text size="large" className="font-medium">
        {t("transaction_other")}
      </Text>

      <View
        style={{
          flex: 1,
          flexGrow: 1,
          minHeight: 50,
          width: "100%",
        }}
      >
        <FlashList
          data={transactions}
          keyExtractor={({ transaction }) => transaction}
          renderItem={({ item }) => <TransactionActivityCard {...item} />}
          estimatedItemSize={ITEM_HEIGHT}
          ListEmptyComponent={<NoAccountsFoundCard />}
        />
      </View>
    </Card>
  );
};
