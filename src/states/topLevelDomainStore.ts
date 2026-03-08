import { create } from "zustand";
import { registerStore } from "@/states/storeRegistry";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type TopLevelDomainMap = { [key: string]: string };

interface State {
  lastUpdated: string;
  topLevelDomains: TopLevelDomainMap;
}

interface Actions {
  reset: () => void;
  setLastUpdated: (value: string) => void;
  setTopLevelDomains: (value: TopLevelDomainMap) => void;
}

const initialState: State = {
  lastUpdated: "",
  topLevelDomains: {},
};

export const topLevelDomainStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      reset: () => {
        set(initialState);
      },
      setLastUpdated: (value) =>
        set(() => ({
          lastUpdated: value,
        })),
      setTopLevelDomains: (value) =>
        set(() => ({
          topLevelDomains: value,
        })),
    }),
    {
      name: "top-level-domain-storage",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);
registerStore(topLevelDomainStore);
