import { eq } from "drizzle-orm";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { differenceInMinutes } from "date-fns";
import { useAccount } from "@/hooks/useAccount";
import { useDatabase } from "@/hooks/useDatabase";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";
import { useLedgerService } from "@/hooks/useLedgerService";
import {
  tokensTransactionalData,
  defaultTokenTransactionalData,
  type TokenTransactionalData,
} from "@/db/schema";

// Explainer time:
// I used the long polling method
// Fetch token transactional data every 4 minutes
// Insert or Update the transactional data
// Last, revalidate the token UI list, so it is sorted by estimated signa value

export const useTokenTransactionalData = (
  tokenId = ""
): TokenTransactionalData => {
  const { accountId } = useAccount();
  const { ledgerService } = useLedgerService();
  const { isActiveNodeSynced, currentNetwork } = useNodeHostStore();
  const db = useDatabase();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["fetchTokenTransactionalData", tokenId],
    queryFn: async () => {
      if (!ledgerService) return defaultTokenTransactionalData;
      const currentDate = new Date();

      const query = await db
        .select()
        .from(tokensTransactionalData)
        .where(eq(tokensTransactionalData.id, tokenId));

      const row = !!query.length && query[0];

      const getTokenPriceNQT = async () => {
        return await ledgerService.token.fetchTokenPriceNQT(tokenId);
      };

      const invalidateTokenQuery = async () => {
        await queryClient.invalidateQueries({
          queryKey: ["fetchAccountTokenHoldings", accountId, currentNetwork],
        });
      };

      // Update the existing row
      if (row) {
        const lastRequestDate = new Date(row.lastUpdated);

        if (differenceInMinutes(currentDate, lastRequestDate) < 4) return row;

        try {
          const tokenPriceNQT = await getTokenPriceNQT();

          const updatePayload: TokenTransactionalData = {
            id: tokenId,
            priceNQT: tokenPriceNQT,
            lastUpdated: currentDate.toString(),
          };

          await db
            .update(tokensTransactionalData)
            .set(updatePayload)
            .where(eq(tokensTransactionalData.id, tokenId));

          return updatePayload;
        } catch (e) {
          return row;
        } finally {
          await invalidateTokenQuery();
        }
      }

      // Insert the new row
      try {
        const tokenPriceNQT = await getTokenPriceNQT();

        const insertPayload: TokenTransactionalData = {
          id: tokenId,
          priceNQT: tokenPriceNQT,
          lastUpdated: currentDate.toString(),
        };

        await db.insert(tokensTransactionalData).values(insertPayload);

        return insertPayload;
      } catch (e) {
        return defaultTokenTransactionalData;
      } finally {
        await invalidateTokenQuery();
      }
    },
    refetchInterval: 120_000,
    staleTime: 120_000,
    enabled: !!(isActiveNodeSynced && !!ledgerService && !!tokenId),
  });

  return data ?? defaultTokenTransactionalData;
};
