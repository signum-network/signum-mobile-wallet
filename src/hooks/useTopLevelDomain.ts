import { topLevelDomainStore } from "@/states/topLevelDomainStore";

export const useTopLevelDomain = (tldId: string): string => {
  const topLevelDomains = topLevelDomainStore((state) => state.topLevelDomains);

  return topLevelDomains[tldId] ?? "";
};
