import { Fragment } from "react";
import { useShallow } from "zustand/react/shallow";
import type { ChildrenProps } from "@/types/childrenProps";
import { useAccount } from "@/hooks/useAccount";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";
import { AccountActivationCard } from "./components/AccountActivationCard";
import { accountStore } from "@/states/accountStore";
import { AppAlert } from "../AppAlert";

// Protect screen from:
// Inactive accounts

// Screens to be protected:
// Account Holdings Overview
// Account Transactions activity
// Subscriptions
// Tokens
// Transfer funds

export const ProtectedScreen = ({ children }: ChildrenProps) => {
  const { publicKey, isAuthenticated } = useAccount();
  const { isTestnet, isActiveNodeSynced } = useNodeHostStore();

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

  const dynamicContent: ChildrenProps["children"] =
    isAuthenticated && isActiveNodeSynced && !isSecured ? (
      <AccountActivationCard />
    ) : (
      children
    );

  return (
    <Fragment>
      <AppAlert />
      {dynamicContent}
    </Fragment>
  );
};
