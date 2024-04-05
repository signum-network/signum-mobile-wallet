import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  type WalletAccount,
  type AccountType,
  type networks,
  type AccountNetworkData,
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

  // Account update related actions
  updateAccountActivationStatus: (
    publicKey: string,
    accountNetwork: networks,
    value: boolean
  ) => void;
  updateAccountData: (
    publicKey: string,
    accountNetwork: networks,
    value: AccountNetworkData
  ) => void;
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
          const { accounts } = get();
          delete accounts[publicKey];

          return {
            accounts,
          };
        });
      },
      updateAccountActivationStatus: (publicKey, accountNetwork, value) => {
        set(() => {
          const { accounts } = get();

          const newValue = accounts;
          newValue[publicKey][accountNetwork].isSecured = value;

          return {
            accounts: newValue,
          };
        });
      },
      updateAccountData: (publicKey, accountNetwork, value) => {
        set(() => {
          const { accounts } = get();

          const newValue = accounts;
          newValue[publicKey][accountNetwork] = value;

          return {
            accounts: newValue,
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
