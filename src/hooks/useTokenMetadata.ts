import { eq } from "drizzle-orm";
import { useQuery } from "@tanstack/react-query";
import { useDatabase } from "@/hooks/useDatabase";
import { useLedgerService } from "@/hooks/useLedgerService";
import { tokens, defaultToken, type Token } from "@/db/schema";

export const useTokenMetadata = (tokenId = ""): Token & { isLoading: boolean } => {
  const { ledgerService } = useLedgerService();
  const db = useDatabase();

  const { data, isLoading } = useQuery({
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
    enabled:
      Boolean(ledgerService) &&
      Boolean(tokenId && tokenId !== "0")
    ,
  });

  return data ? {...data, isLoading } : {...defaultToken, isLoading: true };
};
