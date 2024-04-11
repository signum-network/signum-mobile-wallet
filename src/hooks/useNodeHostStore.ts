import { nodeHostStore } from "@/states/nodeHostStore";

export const useNodeHostStore = () => {
  const connectionType = nodeHostStore((state) => state.connectionType);
  const setConnectionType = nodeHostStore((state) => state.setConnectionType);

  const activeNodeHost = nodeHostStore((state) => state.activeNodeHost);
  const setActiveNodeHost = nodeHostStore((state) => state.setActiveNodeHost);
  const resetActiveNodeHost = nodeHostStore(
    (state) => state.resetActiveNodeHost
  );

  const isActiveNodeAvailable = nodeHostStore(
    (state) => state.isActiveNodeAvailable
  );
  const setIsActiveNodeAvailable = nodeHostStore(
    (state) => state.setIsActiveNodeAvailable
  );

  const isActiveNodeSynced = nodeHostStore((state) => state.isActiveNodeSynced);
  const setIsActiveNodeSynced = nodeHostStore(
    (state) => state.setIsActiveNodeSynced
  );

  const activeNodeSyncedPercentage = nodeHostStore(
    (state) => state.activeNodeSyncedPercentage
  );
  const setActiveNodeSyncedPercentage = nodeHostStore(
    (state) => state.setActiveNodeSyncedPercentage
  );

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

  const resetNodeHostStore = nodeHostStore((state) => state.reset);

  return {
    connectionType,
    activeNodeHost,
    isActiveNodeAvailable,
    isActiveNodeSynced,
    activeNodeSyncedPercentage,
    reliableNodeHost,
    testnetReliableNodeHost,
    customNodeHost,
    isTestnet: activeNodeHost.isTestnet,
    resetNodeHostStore,
    setConnectionType,
    setActiveNodeHost,
    resetActiveNodeHost,
    setReliableNodeHost,
    setTestnetReliableNodeHost,
    addCustomNode,
    removeCustomNode,
    setIsActiveNodeAvailable,
    setIsActiveNodeSynced,
    setActiveNodeSyncedPercentage,
  };
};
