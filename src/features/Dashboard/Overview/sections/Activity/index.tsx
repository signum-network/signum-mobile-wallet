import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";
import { useTranslation } from "react-i18next";
import { View, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";
import type { Transaction } from "@signumjs/core";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { useAccount } from "@/hooks/useAccount";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useLedgerService } from "@/hooks/useLedgerService";
import { NoTransactionsFoundCard } from "@/components/Account/NoTransactionsFoundCard";
import {
  TransactionActivityCard,
  ITEM_HEIGHT,
} from "../../components/TransactionActivityCard";
import { PUBLIC_SIGNUM_FETCH_ACCOUNT_DATA_INTERVAL } from "@/types/constants";
import Ionicons from "@expo/vector-icons/Ionicons";

export const Activity = () => {
  const { t } = useTranslation();
  const { accountId } = useAccount();
  const { iconColor } = useAppTheme();
  const { ledgerService } = useLedgerService();
  const { isActiveNodeSynced, currentNetwork } = useNodeHostStore();

  const { data, isPending } = useQuery({
    queryKey: [
      "fetchAccountTransactionsBasicOverview",
      accountId,
      currentNetwork,
    ],
    queryFn: async () => {
      if (!ledgerService) return;

      const { unconfirmedTransactions } = await ledgerService.account
        .with(accountId)
        .fetchPendingTransactions(true);

      const { transactions } = await ledgerService.account
        .with(accountId)
        .fetchTransactions({
          firstIndex: 0,
          lastIndex: 9,
          includeIndirect: true,
        });

      return { transactions, unconfirmedTransactions };
    },
    refetchInterval: PUBLIC_SIGNUM_FETCH_ACCOUNT_DATA_INTERVAL,
    staleTime: PUBLIC_SIGNUM_FETCH_ACCOUNT_DATA_INTERVAL,
    enabled: isActiveNodeSynced && !!ledgerService,
  });

  const transactions = useMemo<Transaction[]>(() => {
    let newData = [];

    if (data && data.unconfirmedTransactions) {
      newData.push(...data.unconfirmedTransactions);
    }

    if (data && data.transactions) {
      newData.push(...data.transactions);
    }

    return newData;
  }, [data]);

  const isLoading = isPending && !transactions.length;

  return (
    <View className="pb-60">
    <Card>
      <Text size="large" className="font-medium">
        {t("transaction_other")}
      </Text>

      {isLoading ? (
        <View className="gap-2 flex flex-row items-center justify-center">
          <ActivityIndicator />
          <Text color="muted">{t("auth.loadingWait")}</Text>
        </View>
      ) : (
        <View className="w-full gap-4">
          <View
            style={{
              flex: 1,
              flexGrow: 1,
              minHeight: ITEM_HEIGHT,
              width: "100%",
            }}
          >
            <FlashList
              data={transactions}
              keyExtractor={({ transaction }) => transaction}
              renderItem={({ item }) => <TransactionActivityCard {...item} />}
              ListEmptyComponent={<NoTransactionsFoundCard />}
            />
          </View>

          {!!transactions.length && (
            <Button
              title={t("overview.loadMore")}
              type="secondary"
              icon={
                <Ionicons name="search" size={24} color={iconColor.blackout} />
              }
              linkProps={{
                href: "/dashboard/overview/activity",
                push: true,
              }}
            />
          )}
        </View>
      )}
    </Card>
    </View>
  );
};
