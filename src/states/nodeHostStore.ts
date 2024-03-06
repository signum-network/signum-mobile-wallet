import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { nodeHost } from "@/types/nodeHost";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface State {
  activeNodeHost: nodeHost;
  reliableNodeHost: nodeHost[];

  // TODO: Allow the user to add or remove specific custom nodes
  customNodeHost: nodeHost[];
}

interface Actions {
  reset: () => void;
  setActiveNodeHost: (value: nodeHost) => void;
  setReliableNodeHost: (value: nodeHost[]) => void;
}

const initialState: State = {
  activeNodeHost: { name: "", url: "", isTestnet: false },
  reliableNodeHost: [],
  customNodeHost: [],
};

export const nodeHostStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      reset: () => {
        set(initialState);
      },
      setActiveNodeHost: (value: nodeHost) =>
        set(() => ({
          activeNodeHost: value,
        })),
      setReliableNodeHost: (value: nodeHost[]) =>
        set(() => ({
          reliableNodeHost: value,
        })),
    }),
    {
      name: "node-storage",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);
