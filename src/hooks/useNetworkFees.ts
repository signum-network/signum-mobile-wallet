import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Amount } from "@signumjs/util";
import { AttachmentMessage } from "@signumjs/core";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";
import { useLedgerService } from "@/hooks/useLedgerService";
import { type networkFees, defaultNetworkFees } from "@/types/networkFees";
import { PUBLIC_SIGNUM_AVERAGE_BLOCK_TIME_IN_MILLISECONDS } from "@/types/constants";

interface Props {
  attachment?: AttachmentMessage;
}

// TODO: Support encrypted attachments
// TODO: Support binary attachments
export const useNetworkFees = ({ attachment }: Props): networkFees => {
  const { ledgerService } = useLedgerService();
  const {
    networkFees,
    activeNodeHost,
    isActiveNodeSynced,
    isTestnet,
    setNetworkFees,
  } = useNodeHostStore();

  useQuery({
    queryKey: ["fetchNetworkFees", isTestnet],
    queryFn: async () => {
      if (!ledgerService) return;

      try {
        const { cheap, standard, priority } =
          await ledgerService.node.fetchSuggestedFees();

        const payload: networkFees = {
          cheap: Amount.fromPlanck(cheap),
          standard: Amount.fromPlanck(standard),
          priority: Amount.fromPlanck(priority),
        };

        setNetworkFees(payload);

        return payload;
      } catch (error) {
        return alert("Error: Fetch fees");
      }
    },
    refetchInterval: PUBLIC_SIGNUM_AVERAGE_BLOCK_TIME_IN_MILLISECONDS,
    staleTime: PUBLIC_SIGNUM_AVERAGE_BLOCK_TIME_IN_MILLISECONDS,
    enabled: !!activeNodeHost.url && isActiveNodeSynced && !!ledgerService,
  });

  return useMemo(() => {
    if (!networkFees?.cheap?.getSigna) {
      return defaultNetworkFees;
    }

    if (attachment) {
      const byteLength = attachment.messageIsText
        ? attachment.message.length
        : attachment.message.length / 2;

      const { cheap, standard, priority } = networkFees;

      const amountMultiply = Math.min(Math.floor(byteLength / 160) + 1, 6);

      const payload: networkFees = {
        cheap: Amount.fromPlanck(cheap.getPlanck()).multiply(amountMultiply),
        standard: Amount.fromPlanck(standard.getPlanck()).multiply(
          amountMultiply
        ),
        priority: Amount.fromPlanck(priority.getPlanck()).multiply(
          amountMultiply
        ),
      };

      return payload;
    }

    return networkFees;
  }, [networkFees, attachment, isTestnet]);
};
