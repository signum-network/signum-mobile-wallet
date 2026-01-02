import { Fragment } from "react";
import { useShallow } from "zustand/react/shallow";
import type { ChildrenProps } from "@/types/childrenProps";
import { useWalletAccount } from "@/hooks/useWalletAccount";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";
import { NoAccountsFoundCard } from "@/components/Account/NoAccountsFoundCard";
import { AccountActivationCard } from "./components/AccountActivationCard";
import { accountStore } from "@/states/accountStore";
import { AppAlert } from "../AppAlert";

export const ProtectedScreen = ({ children }: ChildrenProps) => {
  const { publicKey, isAuthenticated } = useWalletAccount();
  const { isTestnet, isActiveNodeSynced } = useNodeHostStore();

  const accountKeys = accountStore(
    useShallow((state) => Object.keys(state.accounts))
  );

  const isMainnetSecured = accountStore(
    useShallow(
      (state) => state.accounts?.[publicKey]?.mainnet?.isSecured || false
    )
  );

  const isTestnetSecured = accountStore(
    useShallow(
      (state) => state.accounts?.[publicKey]?.testnet?.isSecured || false
    )
  );

  // Check if account is secured on designated network (Mainnet or Testnet)
  const isSecured =
    (isMainnetSecured && !isTestnet) || (isTestnetSecured && isTestnet);

  let dynamicContent: ChildrenProps["children"] = children;

  if (!accountKeys.length) {
    dynamicContent = <NoAccountsFoundCard />;
  }

  if (isAuthenticated && isActiveNodeSynced && !isSecured) {
    dynamicContent = <AccountActivationCard />;
  }

  return (
    <Fragment>
      <AppAlert />
      {dynamicContent}
    </Fragment>
  );
};
