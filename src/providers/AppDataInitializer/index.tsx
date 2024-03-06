import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ChildrenProps } from "@/types/childrenProps";
import { NodeHostInitializer } from "./NodeHostInitializer";

const queryClient = new QueryClient();

export const AppDataInitializer = ({ children }: ChildrenProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <NodeHostInitializer />
      {children}
    </QueryClientProvider>
  );
};
