import { nodeHostStore } from "@/states/nodeHostStore";

export const useNodeHostStore = () => {
  const activeNodeHost = nodeHostStore((state) => state.activeNodeHost);
  const reliableNodeHost = nodeHostStore((state) => state.reliableNodeHost);
  const testnetReliableNodeHost = nodeHostStore(
    (state) => state.testnetReliableNodeHost
  );

  const { isTestnet } = activeNodeHost;

  const resetNodeHostStore = nodeHostStore((state) => state.reset);

  return {
    activeNodeHost,
    reliableNodeHost,
    testnetReliableNodeHost,
    isTestnet,
    resetNodeHostStore,
  };
};
