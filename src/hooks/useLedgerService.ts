import { useMemo } from "react";
import { LedgerService } from "@/services/ledgerService";
import { nodeHostStore } from "@/states/nodeHostStore";

export const useLedgerService = () => {
  const { url } = nodeHostStore((state) => state.activeNodeHost);

  const ledgerService = useMemo(() => {
    if (!url) return;

    return new LedgerService(url);
  }, [url]);

  return { ledgerService };
};
