import type { Account, Balance } from "@signumjs/core";
import type { LedgerServiceContext } from "../ledgerServiceContext";
import { LedgerSubService } from "../ledgerSubService";
import { handleError } from "../handleError";
import { AccountInstanceService } from "./AccountInstanceService";
import { nodeHostStore } from "@/states/nodeHostStore";
import {
  PUBLIC_SIGNUM_ACCOUNT_ACTIVATOR_MAINNET_URL,
  PUBLIC_SIGNUM_ACCOUNT_ACTIVATOR_TESTNET_URL,
} from "@/types/constants";

export class AccountService extends LedgerSubService {
  constructor(context: LedgerServiceContext) {
    super(context);
  }

  fetchAccount(
    accountId: string,
    includeCommittedAmount = false
  ): Promise<Account> {
    return handleError(async () =>
      this.context.ledger.account.getAccount({
        accountId,
        includeCommittedAmount,
      })
    );
  }

  fetchAccountBalance(accountId: string): Promise<Balance> {
    return handleError(async () =>
      this.context.ledger.account.getAccountBalance(accountId)
    );
  }

  fetchAccountPublicKey(accountId: string): Promise<string> {
    return handleError(async () =>
      this.context.ledger.service
        .query("getAccountPublicKey", {
          account: accountId,
        })
        .then((data: any) => data.publicKey)
    );
  }

  activate(accountId: string, publicKey: string) {
    return handleError(async () => {
      const isTestnet = nodeHostStore.getState().activeNodeHost.isTestnet;

      const signumAccountActivatorUrl = isTestnet
        ? PUBLIC_SIGNUM_ACCOUNT_ACTIVATOR_TESTNET_URL
        : PUBLIC_SIGNUM_ACCOUNT_ACTIVATOR_MAINNET_URL;

      await fetch(`${signumAccountActivatorUrl}/api/activate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: accountId,
          publickey: publicKey,
          ref: "signum-mobile-wallet",
        }),
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }

          return res.text().then((text) => {
            throw new Error(text);
          });
        })
        .catch((error) => {
          throw error;
        });
    });
  }

  async exists(accountId: string): Promise<boolean> {
    try {
      await this.context.ledger.account.getAccount({ accountId });
      return true;
    } catch (e) {
      return false;
    }
  }

  with(accountId: string) {
    return new AccountInstanceService(accountId, this.context);
  }
}
