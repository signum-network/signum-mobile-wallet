import { eq } from "drizzle-orm";
import { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Amount, ChainValue } from "@signumjs/util";
import { useWalletAccount } from "@/hooks/useWalletAccount";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";
import { useDatabase } from "@/hooks/useDatabase";
import { DashboardScreenContainer } from "../components/DashboardScreenContainer";
import { AssetSummary } from "./sections/AssetSummary";
import { AssetList } from "./sections/AssetList";
import type { TokenBalance } from "@/types/account";
import { tokens, tokensTransactionalData } from "@/db/schema";

interface TokenToSignaValue extends TokenBalance {
  estimatedSignaValue: number;
}

export const TokensScreen = () => {
  const {
    accountId,
    accountData: { tokenBalance },
  } = useWalletAccount();
  const db = useDatabase();
  const { isActiveNodeSynced, currentNetwork } = useNodeHostStore();

  const getTokenBalanceToSignaValue = async (
    asset: string,
    balanceQNT: string,
    unconfirmedBalanceQNT: string
  ): Promise<TokenToSignaValue> => {
    return new Promise(async (resolve) => {
      try {
        const metaData = await db
          .select()
          .from(tokens)
          .where(eq(tokens.id, asset));

        const transactionalData = await db
          .select()
          .from(tokensTransactionalData)
          .where(eq(tokensTransactionalData.id, asset));

        const decimals =
          !!metaData.length && metaData[0] ? metaData[0].decimals : 0;

        const tokenPriceNQT =
          !!transactionalData.length && transactionalData[0]
            ? transactionalData[0].priceNQT
            : "0";

        const totalTokenBalance =
          ChainValue.create(decimals).setAtomic(balanceQNT);

        const estimatedSignaValue =
          Number(totalTokenBalance.getCompound()) *
          Number(Amount.fromPlanck(tokenPriceNQT).getSigna());

        resolve({
          asset,
          balanceQNT,
          unconfirmedBalanceQNT,
          estimatedSignaValue,
        });
      } catch (error) {
        resolve({
          asset,
          balanceQNT,
          unconfirmedBalanceQNT,
          estimatedSignaValue: 0,
        });
      }
    });
  };

  const { data } = useQuery({
    queryKey: ["fetchAccountTokenHoldings", accountId, currentNetwork],
    queryFn: async () => {
      const tokenValues: Promise<TokenToSignaValue>[] = [];

      tokenBalance.forEach(async (token) => {
        const { asset, balanceQNT, unconfirmedBalanceQNT } = token;
        tokenValues.push(
          getTokenBalanceToSignaValue(asset, balanceQNT, unconfirmedBalanceQNT)
        );
      });

      let sortedBalances: TokenToSignaValue[] = [];

      await Promise.all(tokenValues).then((values) => {
        sortedBalances = values;
      });

      return sortedBalances;
    },
    refetchInterval: 120_000,
    staleTime: 120_000,
    enabled: isActiveNodeSynced && !!tokenBalance.length,
  });

  const tokenRows: { rows: TokenBalance[]; estimatedSignaValue: number } =
    useMemo(() => {
      if (!data) return { rows: tokenBalance, estimatedSignaValue: 0 };

      let estimation = 0;

      // Calculate in SIGNA the Total assets value
      // Sort tokens by estimated signa value
      // And map them to show it in the UI
      const sortedData = [...data]
        .sort((a, b) => b.estimatedSignaValue - a.estimatedSignaValue)
        .map(
          ({
            asset,
            balanceQNT,
            unconfirmedBalanceQNT,
            estimatedSignaValue,
          }) => {
            estimation += estimatedSignaValue;

            return {
              asset,
              balanceQNT,
              unconfirmedBalanceQNT,
            };
          }
        );

      return { rows: sortedData, estimatedSignaValue: estimation };
    }, [data, tokenBalance]);

  return (
    <ScrollView>
      <DashboardScreenContainer>
        <View className="flex flex-col items-start justify-center w-full px-4 pt-4 mb-4 gap-4">
          <AssetSummary estimatedValue={tokenRows.estimatedSignaValue} />

          <AssetList list={tokenRows.rows} />
        </View>
      </DashboardScreenContainer>
    </ScrollView>
  );
};
