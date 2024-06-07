import { eq } from "drizzle-orm";
import { useQuery } from "@tanstack/react-query";
import { differenceInMinutes } from "date-fns";
import { useDatabaseContext } from "@/hooks/useDatabaseContext";
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

export const useTokenTransactionalData = (
  tokenId = ""
): TokenTransactionalData => {
  const { ledgerService } = useLedgerService();
  const { isActiveNodeSynced } = useNodeHostStore();
  const db = useDatabaseContext();

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
      }
    },
    refetchInterval: 120_000,
    staleTime: 120_000,
    enabled: !!(isActiveNodeSynced && !!ledgerService && !!tokenId),
  });

  return data ?? defaultTokenTransactionalData;
};
