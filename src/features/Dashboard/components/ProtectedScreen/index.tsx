import { Fragment } from "react";
import { AppAlert } from "../AppAlert";
import type { ChildrenProps } from "@/types/childrenProps";

// Protect screen from:
// Inactive accounts

// Screens to be protected:
// Account Holdings Overview
// Account Transactions activity
// Subscriptions
// Tokens
// Transfer funds

export const ProtectedScreen = ({ children }: ChildrenProps) => {
  return (
    <Fragment>
      <AppAlert />
      {children}
    </Fragment>
  );
};
