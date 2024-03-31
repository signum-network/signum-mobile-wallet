import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { nodeHost } from "@/types/nodeHost";
import type { nodeConnectionTypes } from "@/types/nodeConnectionTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface State {
  connectionType: nodeConnectionTypes;
  activeNodeHost: nodeHost;
  reliableNodeHost: nodeHost[];
  testnetReliableNodeHost: nodeHost[];
  customNodeHost: nodeHost[];
}

interface Actions {
  reset: () => void;
  setConnectionType: (value: nodeConnectionTypes) => void;
  setActiveNodeHost: (value: nodeHost) => void;
  setReliableNodeHost: (value: nodeHost[]) => void;
  setTestnetReliableNodeHost: (value: nodeHost[]) => void;
  addCustomNode: (value: nodeHost) => void;
  removeCustomNode: (value: string) => void; // remove custom node by name
}

const initialState: State = {
  connectionType: "automatic",
  activeNodeHost: { name: "", url: "", isTestnet: false },
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
          const newCustomNodeHost = [...customNodeHost, value];

          return {
            customNodeHost: newCustomNodeHost,
          };
        }),
      removeCustomNode: (value) =>
        set(() => {
          const { customNodeHost } = get();
          const newCustomNodeHost = [...customNodeHost].filter(
            (node) => node.name !== value
          );

          return {
            customNodeHost: newCustomNodeHost,
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
