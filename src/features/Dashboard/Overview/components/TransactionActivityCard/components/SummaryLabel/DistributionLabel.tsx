import { eq, and } from "drizzle-orm";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "@/hooks/useAccount";
import { useDatabaseContext } from "@/hooks/useDatabaseContext";
import { useLedgerService } from "@/hooks/useLedgerService";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";
import { distributionAmounts, defaultDistributionAmount } from "@/db/schema";
import { AmountText } from "./AmountText";

interface Props {
  transaction: string;
  assetToDistribute?: string;
}

export const DistributionLabel = ({
  transaction,
  assetToDistribute,
}: Props) => {
  const { accountId } = useAccount();
  const { ledgerService } = useLedgerService();
  const { isActiveNodeSynced } = useNodeHostStore();
  const db = useDatabaseContext();

  const { data } = useQuery({
    queryKey: ["fetchDistributionAmount", accountId, transaction],
    queryFn: async () => {
      if (!ledgerService) return defaultDistributionAmount;

      const query = await db
        .select()
        .from(distributionAmounts)
        .where(
          and(
            eq(distributionAmounts.id, transaction),
            eq(distributionAmounts.account, accountId)
          )
        );

      const row = !!query.length && query[0];

      if (row) return row;

      try {
        const transactionData = await ledgerService.account
          .with(accountId)
          .fetchTransactionDistributionAmount(transaction);

        if (!transactionData) return defaultDistributionAmount;

        await db.insert(distributionAmounts).values({
          id: transaction,
          account: accountId,
          amountNQT: transactionData.amountNQT,
          quantityQNT: transactionData.quantityQNT ?? "0",
        });

        return transactionData;
      } catch (error) {
        return defaultDistributionAmount;
      }
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    staleTime: Infinity,
    enabled: isActiveNodeSynced && !!ledgerService,
  });

  const { amountNQT, quantityQNT } = data ?? defaultDistributionAmount;

  return (
    <>
      {amountNQT !== "0" && <AmountText isSender={false} value={amountNQT} />}

      {!!(
        assetToDistribute &&
        assetToDistribute !== "0" &&
        quantityQNT &&
        quantityQNT !== "0"
      ) && <AmountText tokenId={assetToDistribute} value={quantityQNT} />}
    </>
  );
};
