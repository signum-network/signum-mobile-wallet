import { Fragment, useMemo } from "react";
import { AppAlert } from "../AppAlert";
import type { ChildrenProps } from "@/types/childrenProps";
import { useAccount } from "@/hooks/useAccount";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";
import { Text } from "@/components/Text";

// Protect screen from:
// Inactive accounts

// Screens to be protected:
// Account Holdings Overview
// Account Transactions activity
// Subscriptions
// Tokens
// Transfer funds

export const ProtectedScreen = ({ children }: ChildrenProps) => {
  const { isAuthenticated, isSecured } = useAccount();
  const { isActiveNodeSynced } = useNodeHostStore();

  const dynamicContent: ChildrenProps["children"] = useMemo(() => {
    if (isAuthenticated && isActiveNodeSynced && !isSecured) {
      return <Text>The account is unsafe</Text>;
    }

    return children;
  }, [isAuthenticated, isSecured, isActiveNodeSynced]);

  return (
    <Fragment>
      <AppAlert />
      {dynamicContent}
    </Fragment>
  );
};
