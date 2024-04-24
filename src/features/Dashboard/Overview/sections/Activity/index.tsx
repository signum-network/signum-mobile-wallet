import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { useAccount } from "@/hooks/useAccount";
import { TransactionActivityCard } from "../../components/TransactionActivityCard";

export const Activity = () => {
  const { t } = useTranslation();

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
        <TransactionActivityCard />
        <TransactionActivityCard />
        <TransactionActivityCard />
        <TransactionActivityCard />
        <TransactionActivityCard />
        <TransactionActivityCard />
        <TransactionActivityCard />
        <TransactionActivityCard />
        <TransactionActivityCard />
        <TransactionActivityCard />
        <TransactionActivityCard />
        <TransactionActivityCard />
        <TransactionActivityCard />
        <TransactionActivityCard />
        <TransactionActivityCard />
      </View>
    </Card>
  );
};
