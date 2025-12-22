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

    parseTransactionBytes(transactionBytes: string) {
        return handleError(async () => {
            return this.context.ledger.transaction.parseTransactionBytes(transactionBytes)
        })
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

    const res = await fetch(`${signumAccountActivatorUrl}/api/activate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        account: accountId,
        publickey: publicKey,
        ref: "signum-mobile-wallet",
      }),
    });

    // Error case: Return the text if available, otherwise a generic message.
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `HTTP ${res.status} ${res.statusText}`);
    }

    // 204 or empty body? => nothing to parse, simply return
    if (res.status === 204) return;

    // Only parse if Content-Type is JSON AND the body is not empty
    const ctype = res.headers.get("content-type") || "";
    if (!ctype.includes("application/json")) {
      return; // intentionally not an error – the endpoint is allowed to respond without JSON
    }

    const raw = await res.text(); // read text first
    if (!raw || !raw.trim()) return; // Empty body => OK, no data expected

    try {
      return JSON.parse(raw); // valid JSON
    } catch {
      throw new Error("Invalid JSON from account activator endpoint");
    }
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
