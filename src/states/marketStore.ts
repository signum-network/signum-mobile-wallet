import { create } from "zustand";
import { registerStore } from "@/states/storeRegistry";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  type SupportedTickerSymbol,
  type Market,
  defaultCurrency,
  defaultMarket,
} from "@/types/currencies";
import AsyncStorage from "@react-native-async-storage/async-storage";

type CurrencyMap = { [key: string]: Market };

interface State {
  activeCurrency: SupportedTickerSymbol;
  markets: CurrencyMap;
}

interface Actions {
  reset: () => void;
  setActiveCurrency: (value: SupportedTickerSymbol) => void;
  updateMarketRate: (value: Market) => void;
}

const initialState: State = {
  activeCurrency: defaultCurrency,
  markets: {
    [defaultCurrency]: defaultMarket,
  },
};

export const marketStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,
      reset: () => {
        set(initialState);
      },
      setActiveCurrency: (value) =>
        set(() => ({
          activeCurrency: value,
        })),
      updateMarketRate: (value) => {
        set(() => {
          const { markets } = get();

          const newValue = markets;
          newValue[value.id] = value;

          return {
            markets: { ...newValue },
          };
        });
      },
    }),
    {
      name: "market-storage",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);
registerStore(marketStore);
