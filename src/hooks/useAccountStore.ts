import { accountStore } from "@/states/accountStore";

export const useAccountStore = () => {
  const accounts = accountStore((state) => state.accounts);
  const addAccount = accountStore((state) => state.addAccount);
  const deleteAccount = accountStore((state) => state.deleteAccount);

  const activeAccount = accountStore((state) => state.activeAccount);
  const setActiveAccount = accountStore((state) => state.setActiveAccount);

  const isAccountEnrolled = !!Object.keys(accounts).length;

  const accountPublicKeys = Object.keys(accounts);

  const resetAccountStore = accountStore((state) => state.reset);

  return {
    isAccountEnrolled,
    accountPublicKeys,
    accounts,
    activeAccount,
    addAccount,
    deleteAccount,
    setActiveAccount,
    resetAccountStore,
  };
};
