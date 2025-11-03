import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  type WalletAccount,
  type AccountType,
  type AccountNetworkData,
  type AccountBalance,
  defaultAccountNetworkData,
} from "@/types/account";
import type { networks } from "@/types/networks";
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
  updateAccountPublicKeyActivationStatus: (
    publicKey: string,
    accountNetwork: networks,
    value: boolean
  ) => void;
  updateAccountData: (
    publicKey: string,
    accountNetwork: networks,
    value: AccountNetworkData
  ) => void;
  updateAccountBalance: (
    publicKey: string,
    accountNetwork: networks,
    value: AccountBalance
  ) => void;
}

const initialState: State = {
  activeAccount: "",
  accounts: {},
};

const deepClone = <T,>(o: T): T => JSON.parse(JSON.stringify(o));


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
      addAccount: ({ publicKey, type, walletName }) =>
        set(() => {
          const { accounts } = get();

          const initialAccountData: WalletAccount = {
            type,
            publicKey,
            walletName,
      addedAt: Date.now(),
      mainnet: deepClone(defaultAccountNetworkData),
      testnet: deepClone(defaultAccountNetworkData),
          };

          const newValue = accounts;
          newValue[publicKey] = initialAccountData;

          return {
            accounts: { ...newValue },
          };
        }),
      deleteAccount: (publicKey) => {
        set(() => {
          const { accounts } = get();

          const newValue = accounts;
          delete newValue[publicKey];

          return {
            accounts: { ...newValue },
          };
        });
      },
      updateAccountActivationStatus: (publicKey, accountNetwork, value) => {
        set(() => {
          const { accounts } = get();

          const newValue = accounts;
          newValue[publicKey][accountNetwork].isSecured = value;
          newValue[publicKey][accountNetwork].loading = false;

          if (value) {
            newValue[publicKey][accountNetwork].activationInProgress = false;
          }

          return {
            accounts: { ...newValue },
          };
        });
      },
      updateAccountPublicKeyActivationStatus: (
        publicKey,
        accountNetwork,
        value
      ) => {
        set(() => {
          const { accounts } = get();

          const newValue = accounts;
          newValue[publicKey][accountNetwork].activationInProgress = value;

          return {
            accounts: { ...newValue },
          };
        });
      },
      updateAccountData: (publicKey, accountNetwork, value) => {
        set(() => {
          const { accounts } = get();

          const newValue = accounts;
          newValue[publicKey][accountNetwork] = value;

          return {
            accounts: { ...newValue },
          };
        });
      },
      updateAccountBalance: (publicKey, accountNetwork, value) => {
        set(() => {
          const { accounts } = get();

          const newValue = accounts;
          newValue[publicKey][accountNetwork].balance = value;

          return {
            accounts: { ...newValue },
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
