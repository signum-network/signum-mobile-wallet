import { nodeHostStore } from "@/states/nodeHostStore";
import { LedgerService } from "@/services/ledgerService";

// useLedgerService is only used as a hook
// getLedgerService is NEVER used as a hook

export const getLedgerService = () => {
  const { url } = nodeHostStore.getState().activeNodeHost;

  const ledgerService = new LedgerService(url);

  return { ledgerService };
};
