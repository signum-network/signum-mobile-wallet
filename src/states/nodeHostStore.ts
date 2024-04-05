import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type nodeHost, defaultNodeHost } from "@/types/nodeHost";
import type { nodeConnectionTypes } from "@/types/nodeConnectionTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface State {
  connectionType: nodeConnectionTypes;
  activeNodeHost: nodeHost;
  isActiveNodeAvailable: boolean;
  isActiveNodeSynced: boolean;
  activeNodeSyncedPercentage: number;
  reliableNodeHost: nodeHost[];
  testnetReliableNodeHost: nodeHost[];
  customNodeHost: nodeHost[];
}

interface Actions {
  reset: () => void;
  setConnectionType: (value: nodeConnectionTypes) => void;
  setActiveNodeHost: (value: nodeHost) => void;
  setIsActiveNodeAvailable: (value: boolean) => void;
  setIsActiveNodeSynced: (value: boolean) => void;
  setActiveNodeSyncedPercentage: (value: number) => void;
  resetActiveNodeHost: () => void;
  setReliableNodeHost: (value: nodeHost[]) => void;
  setTestnetReliableNodeHost: (value: nodeHost[]) => void;
  addCustomNode: (value: nodeHost) => void;
  removeCustomNode: (value: string) => void; // remove custom node by name
}

const initialState: State = {
  connectionType: "automatic",
  activeNodeHost: defaultNodeHost,
  isActiveNodeAvailable: false,
  isActiveNodeSynced: false,
  activeNodeSyncedPercentage: 0,
  reliableNodeHost: [],
  testnetReliableNodeHost: [],
  customNodeHost: [],
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
    }),
    {
      name: "node-storage",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);
