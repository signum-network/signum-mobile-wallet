import { Amount } from "@signumjs/util";

export enum AccountType {
  mnemonic = "mnemonic",
  watchOnly = "watchOnly",
}

export interface AccountBalance {
  totalBalance: Amount;
  committedBalance: Amount;
  reservedBalance: Amount;
  availableBalance: Amount;
}

export interface AccountNetworkData {
  isActive: boolean;
  name: string;
  description: string;
  balance: AccountBalance;
}

export interface WalletAccount {
  type: AccountType;
  publicKey: string;
  walletName: string;
  addedAt: number;
  mainnet: AccountNetworkData;
  testnet: AccountNetworkData;
}

export const defaultAccountNetworkData: AccountNetworkData = {
  isActive: false,
  name: "",
  description: "",
  balance: {
    totalBalance: Amount.Zero(),
    committedBalance: Amount.Zero(),
    availableBalance: Amount.Zero(),
    reservedBalance: Amount.Zero(),
  },
};
