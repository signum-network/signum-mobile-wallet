import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ChildrenProps } from "@/types/childrenProps";
import { NodeHostInitializer } from "./NodeHostInitializer";
import { AccountInitializer } from "./AccountInitializer";
import { OnlineManagerInitializer } from "./OnlineManagerInitializer";
import { MarketInitializer } from "./MarketInitializer";
import { TopLevelDomainInitializer } from "./TopLevelDomainInitializer";

const queryClient = new QueryClient();

export const DataInitializer = ({ children }: ChildrenProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <NodeHostInitializer />
      <AccountInitializer />
      <OnlineManagerInitializer />
      <MarketInitializer />
      <TopLevelDomainInitializer />

      {children}
    </QueryClientProvider>
  );
};
