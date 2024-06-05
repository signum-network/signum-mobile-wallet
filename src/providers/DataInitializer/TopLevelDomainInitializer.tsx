import { differenceInMinutes } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useLedgerService } from "@/hooks/useLedgerService";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";
import { useTopLevelDomainStore } from "@/hooks/useTopLevelDomainStore";

export const TopLevelDomainInitializer = () => {
  const { ledgerService } = useLedgerService();
  const { activeNodeHost, isActiveNodeSynced, currentNetwork } =
    useNodeHostStore();
  const { lastUpdated, topLevelDomains, setLastUpdated, setTopLevelDomains } =
    useTopLevelDomainStore();

  useQuery({
    queryKey: ["fetchTopLevelDomains", currentNetwork],
    queryFn: async () => {
      if (!ledgerService) return;

      const currentDate = new Date();

      // Check if the last request happened 30 minutes ago
      if (!!lastUpdated) {
        const lastRequestDate = new Date(lastUpdated);

        if (differenceInMinutes(currentDate, lastRequestDate) < 30) {
          return false;
        }
      }

      try {
        const currentTopLevelDomains = { ...topLevelDomains };
        const { tlds } = await ledgerService.node.fetchTopLevelDomains();

        tlds.forEach(({ alias, aliasName }) => {
          if (currentTopLevelDomains[alias]) return;

          currentTopLevelDomains[alias] = aliasName;
        });

        setTopLevelDomains(currentTopLevelDomains);

        setLastUpdated(currentDate.toString());

        return true;
      } catch (error) {
        return false;
      }
    },
    refetchInterval: 600_000,
    staleTime: 600_000,
    enabled: !!activeNodeHost.url && isActiveNodeSynced && !!ledgerService,
  });

  return null;
};
