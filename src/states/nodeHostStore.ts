import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type NodeHost, defaultNodeHost } from "@/types/nodeHost";
import type { nodeConnectionTypes } from "@/types/nodeConnectionTypes";
import { type networkFees, defaultNetworkFees } from "@/types/networkFees";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PUBLIC_SIGNUM_DEFAULT_NODE_URL, PUBLIC_SIGNUM_DEFAULT_NODE_NAME } from "@/types/constants";

interface State {
  connectionType: nodeConnectionTypes;
  activeNodeHost: NodeHost;
  isActiveNodeAvailable: boolean;
  isActiveNodeSynced: boolean;
  activeNodeSyncedPercentage: number;
  activeNodeNumberOfBlocks: number;
  reliableNodeHost: NodeHost[];
  testnetReliableNodeHost: NodeHost[];
  customNodeHost: NodeHost[];
  networkFees: networkFees;
}

interface Actions {
  reset: () => void;
  setConnectionType: (value: nodeConnectionTypes) => void;
  setActiveNodeHost: (value: NodeHost) => void;
  setIsActiveNodeAvailable: (value: boolean) => void;
  setIsActiveNodeSynced: (value: boolean) => void;
  setActiveNodeSyncedPercentage: (value: number) => void;
  setActiveNodeNumberOfBlocks: (value: number) => void;
  resetActiveNodeHost: () => void;
  setReliableNodeHost: (value: NodeHost[]) => void;
  setTestnetReliableNodeHost: (value: NodeHost[]) => void;
  addCustomNode: (value: NodeHost) => void;
  removeCustomNode: (value: string) => void; // remove custom node by name
  setNetworkFees: (value: networkFees) => void;
}

const initialState: State = {
  connectionType: "automatic",
  activeNodeHost: defaultNodeHost,
  isActiveNodeAvailable: false,
  isActiveNodeSynced: false,
  activeNodeSyncedPercentage: 0,
  activeNodeNumberOfBlocks: 0,
  reliableNodeHost: [{
    name: PUBLIC_SIGNUM_DEFAULT_NODE_NAME,
    url: PUBLIC_SIGNUM_DEFAULT_NODE_URL,
    isTestnet: false,
  }],
  testnetReliableNodeHost: [],
  customNodeHost: [],
  networkFees: defaultNetworkFees,
};

export const nodeHostStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,
      reset: () => {
        set(initialState);
      },
      setConnectionType: (value) =>
        set(() => ({
          connectionType: value,
        })),
      setActiveNodeHost: (value) =>
        set(() => ({
          activeNodeHost: value,
        })),
      setIsActiveNodeAvailable: (value) =>
        set(() => ({
          isActiveNodeAvailable: value,
        })),
      setIsActiveNodeSynced: (value) =>
        set(() => ({
          isActiveNodeSynced: value,
        })),
      setActiveNodeSyncedPercentage: (value) =>
        set(() => ({
          activeNodeSyncedPercentage: value,
        })),
      setActiveNodeNumberOfBlocks: (value) =>
        set(() => ({
          activeNodeNumberOfBlocks: value,
        })),
      resetActiveNodeHost: () =>
        set(() => ({
          activeNodeHost: defaultNodeHost,
        })),
      setReliableNodeHost: (value) =>
        set(() => ({
          reliableNodeHost: value,
        })),
      setTestnetReliableNodeHost: (value) =>
        set(() => ({
          testnetReliableNodeHost: value,
        })),
      addCustomNode: (value) =>
        set(() => {
          const { customNodeHost } = get();
          const newValue = [...customNodeHost, value];

          return {
            customNodeHost: newValue,
          };
        }),
      removeCustomNode: (value) =>
        set(() => {
          const { customNodeHost } = get();
          const newValue = [...customNodeHost].filter(
            (node) => node.name !== value
          );

          return {
            customNodeHost: newValue,
          };
        }),
      setNetworkFees: (value) =>
        set(() => ({
          networkFees: value,
        })),
    }),
    {
      name: "node-storage",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);
