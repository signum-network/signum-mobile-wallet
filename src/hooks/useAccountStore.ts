import { accountStore } from "@/states/accountStore";

export const useAccountStore = () => {
  const accounts = accountStore((state) => state.accounts);
  const addAccount = accountStore((state) => state.addAccount);
  const deleteAccount = accountStore((state) => state.deleteAccount);

  const activeAccount = accountStore((state) => state.activeAccount);
  const setActiveAccount = accountStore((state) => state.setActiveAccount);

  const isAccountEnrolled = !!Object.keys(accounts).length;

  const accountPublicKeys = Object.keys(accounts);

  const accountWalletNames = Object.values(accounts).map((account) =>
    account.walletName.toLowerCase()
  );

  const updateAccountActivationStatus = accountStore(
    (state) => state.updateAccountActivationStatus
  );

  const updateAccountPublicKeyActivationStatus = accountStore(
    (state) => state.updateAccountPublicKeyActivationStatus
  );

  const updateAccountData = accountStore((state) => state.updateAccountData);
  const updateAccountBalance = accountStore(
    (state) => state.updateAccountBalance
  );

  const resetAccountStore = accountStore((state) => state.reset);

  return {
    isAccountEnrolled,
    accountPublicKeys,
    accountWalletNames,
    accounts,
    activeAccount,
    addAccount,
    deleteAccount,
    setActiveAccount,
    resetAccountStore,
    updateAccountActivationStatus,
    updateAccountPublicKeyActivationStatus,
    updateAccountData,
    updateAccountBalance,
  };
};
