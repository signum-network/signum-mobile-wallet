import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ChildrenProps } from "@/types/childrenProps";
import { NodeHostInitializer } from "./NodeHostInitializer";
import { AccountInitializer } from "./AccountInitializer";
import { OnlineManagerInitializer } from "./OnlineManagerInitializer";
import { MarketInitializer } from "./MarketInitializer";

const queryClient = new QueryClient();

export const AppDataInitializer = ({ children }: ChildrenProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <NodeHostInitializer />
      <AccountInitializer />
      <OnlineManagerInitializer />
      <MarketInitializer />

      {children}
    </QueryClientProvider>
  );
};
