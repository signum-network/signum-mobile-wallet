import { ScrollView, View, ActivityIndicator } from "react-native";
import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";
import { useTranslation } from "react-i18next";
import { FlashList } from "@shopify/flash-list";
import type { Transaction } from "@signumjs/core";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useWalletAccount } from "@/hooks/useWalletAccount";
import { useLedgerService } from "@/hooks/useLedgerService";
import { NoTransactionsFoundCard } from "@/components/Account/NoTransactionsFoundCard";
import {
  TransactionActivityCard,
  ITEM_HEIGHT,
} from "../components/TransactionActivityCard";
import { PUBLIC_SIGNUM_FETCH_ACCOUNT_DATA_INTERVAL } from "@/types/constants";
import { DashboardScreenContainer } from "../../components/DashboardScreenContainer";
import { AppHeader } from "@/components/AppHeader";

export const ActivityScreen = () => {
  const { t } = useTranslation();
  const { accountId } = useWalletAccount();
  const { ledgerService } = useLedgerService();
  const { isActiveNodeSynced, currentNetwork } = useNodeHostStore();

  const [firstIndex, setFirstIndex] = useState(0);
  const [lastIndex, setLastIndex] = useState(9);
  const [isListComplete, setIsListComplete] = useState(false);

  const [isLoadingAccountTransactions, setIsLoadingAccountTransactions] =
    useState(true);

  const [accountTransactions, setAccountTransactions] = useState<Transaction[]>(
    []
  );

  const { data: unconfirmedTransactions, isPending } = useQuery({
    queryKey: [
      "fetchUnconfirmedAccountTransactionsBasicOverview",
      accountId,
      currentNetwork,
    ],
    queryFn: async () => {
      if (!ledgerService) return;

      const { unconfirmedTransactions } = await ledgerService.account
        .with(accountId)
        .fetchPendingTransactions(true);

      return unconfirmedTransactions;
    },
    refetchInterval: PUBLIC_SIGNUM_FETCH_ACCOUNT_DATA_INTERVAL,
    staleTime: PUBLIC_SIGNUM_FETCH_ACCOUNT_DATA_INTERVAL,
    enabled: isActiveNodeSynced && !!ledgerService,
  });

  const fetchAccountTransactions = async () => {
    if (!ledgerService) return;

    const transactionsToAdd = 24;

    setIsLoadingAccountTransactions(true);

    const { transactions, nextIndex } = await ledgerService.account
      .with(accountId)
      .fetchTransactions({
        firstIndex,
        lastIndex,
        includeIndirect: true,
      });

    if (!firstIndex) {
      setAccountTransactions(transactions);
    } else {
      const newTransactions = [...accountTransactions, ...transactions];
      setAccountTransactions(newTransactions);
    }

    if (nextIndex) {
      setFirstIndex(nextIndex);
      setLastIndex(nextIndex + transactionsToAdd);
    } else {
      setIsListComplete(true);
    }

    setIsLoadingAccountTransactions(false);
  };

  useEffect(() => {
    fetchAccountTransactions();
  }, []);

  const transactions = useMemo<Transaction[]>(() => {
    let newData = [];

    if (unconfirmedTransactions && unconfirmedTransactions) {
      newData.push(...unconfirmedTransactions);
    }

    if (accountTransactions && accountTransactions) {
      newData.push(...accountTransactions);
    }

    return newData;
  }, [unconfirmedTransactions, accountTransactions]);

  const isLoading =
    isLoadingAccountTransactions && isPending && !transactions.length;

  const canShowLoadMoreButton = !!transactions.length && !isListComplete;

  return (
    <>
     <AppHeader title={t("transaction_other")} />
    <ScrollView>
      <DashboardScreenContainer>
        <View className="flex flex-col items-start justify-center w-full px-4 pt-4 gap-4">
          <Card>
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
                    renderItem={({ item }) => (
                      <TransactionActivityCard {...item} />
                    )}
                    ListEmptyComponent={<NoTransactionsFoundCard />}
                  />
                </View>

                {canShowLoadMoreButton && (
                  <Button
                    title={t(
                      isLoadingAccountTransactions
                        ? "loading"
                        : "overview.loadMore"
                    )}
                    type="primary"
                    disabled={isLoadingAccountTransactions}
                    pressableProps={{
                      onPress: () => fetchAccountTransactions(),
                    }}
                  />
                )}
              </View>
            )}
          </Card>
        </View>
      </DashboardScreenContainer>
    </ScrollView>
    </>
  );
};
