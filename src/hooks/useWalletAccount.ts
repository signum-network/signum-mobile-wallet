import { useMemo } from "react";
import { Address } from "@signumjs/core";
import { useAccountStore } from "@/hooks/useAccountStore";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";
import {
  type WalletAccount,
  type AccountNetworkData,
  AccountType,
  defaultAccountNetworkData,
} from "@/types/account";

interface WalletAccountData
  extends Omit<WalletAccount, "mainnet" | "testnet"> {
  isAuthenticated: boolean; // Confirm if the wallet is actively using an account (The account type does not matter)
  isWatchOnly: boolean; // Check if user is currently using a watch only account
  accountId: string;
  accountData: AccountNetworkData;
}

const defaultWalletAccountData: WalletAccountData = {
  isAuthenticated: false,
  isWatchOnly: false,
  type: AccountType.mnemonic,
  publicKey: "",
  accountId: "",
  walletName: "",
  addedAt: 0,
  accountData: defaultAccountNetworkData,
};

export const useWalletAccount = (): WalletAccountData => {
  const { activeAccount, accounts } = useAccountStore();
  const { isTestnet } = useNodeHostStore();

  return useMemo(() => {
    if (!activeAccount || !accounts[activeAccount]) {
      return defaultWalletAccountData;
    }

    const { type, publicKey, walletName, addedAt, mainnet, testnet } =
      accounts[activeAccount];

    const accountId = Address.fromPublicKey(publicKey).getNumericId();

    const accountData = isTestnet ? testnet : mainnet;

    return {
      isAuthenticated: !!publicKey,
      isWatchOnly: type === AccountType.watchOnly,
      type,
      publicKey,
      accountId,
      walletName,
      addedAt,
      accountData: accountData,
    };
  }, [activeAccount, accounts, isTestnet]);
};
