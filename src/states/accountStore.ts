import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  type WalletAccount,
  type AccountType,
  defaultAccountNetworkData,
} from "@/types/account";

import AsyncStorage from "@react-native-async-storage/async-storage";

type addAccountParams = {
  publicKey: string;
  type: AccountType;
  walletName: string;
};

type AccountMap = { [key: string]: WalletAccount };

interface State {
  activeAccount: string; // Find account chosen by the user with Public Key
  accounts: AccountMap; // List of accounts
}

interface Actions {
  reset: () => void;
  setActiveAccount: (publicKey: string) => void;
  addAccount: ({ publicKey, type, walletName }: addAccountParams) => void;
  deleteAccount: (publicKey: string) => void;
  //   updateAccount: (publicKey: string) => void;
}

const initialState: State = {
  activeAccount: "",
  accounts: {},
};

export const accountStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,
      reset: () => {
        set(initialState);
      },
      setActiveAccount: (publicKey) =>
        set(() => ({
          activeAccount: publicKey,
        })),
      addAccount: async ({ publicKey, type, walletName }) =>
        set(() => {
          const { accounts } = get();

          const initialAccountData: WalletAccount = {
            type,
            publicKey,
            walletName,
            addedAt: new Date().getTime(),
            mainnet: defaultAccountNetworkData,
            testnet: defaultAccountNetworkData,
          };

          accounts[publicKey] = initialAccountData;

          return {
            accounts,
          };
        }),
      deleteAccount: (publicKey) => {
        set(() => {
          const accounts = get().accounts;
          delete accounts[publicKey];

          return {
            accounts,
          };
        });
      },
    }),
    {
      name: "account-storage",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);
