import { eq } from "drizzle-orm";
import { useQuery } from "@tanstack/react-query";
import { useDatabaseContext } from "@/hooks/useDatabaseContext";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";
import { useLedgerService } from "@/hooks/useLedgerService";
import { tokens, defaultToken, type Token } from "@/db/schema";

export const useToken = (tokenId = ""): Token => {
  const { ledgerService } = useLedgerService();
  const { isActiveNodeSynced } = useNodeHostStore();
  const db = useDatabaseContext();

  const { data } = useQuery({
    queryKey: ["fetchToken", tokenId],
    queryFn: async () => {
      if (!ledgerService || tokenId === "0") return defaultToken;

      const query = await db
        .select()
        .from(tokens)
        .where(eq(tokens.id, tokenId));

      const row = !!query.length && query[0];

      if (row) return row;

      try {
        const metaData = await ledgerService.token.fetchMetaData(tokenId);
        if (!metaData) return defaultToken;

        await db.insert(tokens).values(metaData);

        return metaData;
      } catch (error) {
        return defaultToken;
      }
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    staleTime: Infinity,
    enabled: !!(isActiveNodeSynced && !!ledgerService && !!tokenId),
  });

  return data ?? defaultToken;
};
