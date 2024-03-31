import { nodeHostStore } from "@/states/nodeHostStore";

export const useNodeHostStore = () => {
  const connectionType = nodeHostStore((state) => state.connectionType);
  const setConnectionType = nodeHostStore((state) => state.setConnectionType);

  const activeNodeHost = nodeHostStore((state) => state.activeNodeHost);
  const setActiveNodeHost = nodeHostStore((state) => state.setActiveNodeHost);

  const reliableNodeHost = nodeHostStore((state) => state.reliableNodeHost);
  const setReliableNodeHost = nodeHostStore(
    (state) => state.setReliableNodeHost
  );

  const testnetReliableNodeHost = nodeHostStore(
    (state) => state.testnetReliableNodeHost
  );
  const setTestnetReliableNodeHost = nodeHostStore(
    (state) => state.setTestnetReliableNodeHost
  );

  const customNodeHost = nodeHostStore((state) => state.customNodeHost);
  const addCustomNode = nodeHostStore((state) => state.addCustomNode);
  const removeCustomNode = nodeHostStore((state) => state.removeCustomNode);

  const { isTestnet } = activeNodeHost;

  const resetNodeHostStore = nodeHostStore((state) => state.reset);

  return {
    connectionType,
    activeNodeHost,
    reliableNodeHost,
    testnetReliableNodeHost,
    customNodeHost,
    isTestnet,
    resetNodeHostStore,
    setConnectionType,
    setActiveNodeHost,
    setReliableNodeHost,
    setTestnetReliableNodeHost,
    addCustomNode,
    removeCustomNode,
  };
};
