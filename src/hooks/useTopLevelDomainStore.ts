import { topLevelDomainStore } from "@/states/topLevelDomainStore";

export const useTopLevelDomainStore = () => {
  const lastUpdated = topLevelDomainStore((state) => state.lastUpdated);
  const setLastUpdated = topLevelDomainStore((state) => state.setLastUpdated);

  const topLevelDomains = topLevelDomainStore((state) => state.topLevelDomains);
  const setTopLevelDomains = topLevelDomainStore(
    (state) => state.setTopLevelDomains
  );

  const resetTopLevelDomainsStore = topLevelDomainStore((state) => state.reset);

  return {
    lastUpdated,
    topLevelDomains,
    setLastUpdated,
    setTopLevelDomains,
    resetTopLevelDomainsStore,
  };
};
