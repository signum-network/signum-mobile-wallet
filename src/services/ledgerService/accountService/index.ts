import { type Account } from "@signumjs/core";
import { type LedgerServiceContext } from "../ledgerServiceContext";
import { LedgerSubService } from "../ledgerSubService";
import { handleError } from "../handleError";

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

  fetchAccountPublicKey(accountId: string): Promise<string> {
    return handleError(async () =>
      this.context.ledger.service
        .query("getAccountPublicKey", {
          account: accountId,
        })
        .then((data: any) => data.publicKey)
    );
  }

  async exists(accountId: string): Promise<boolean> {
    try {
      await this.context.ledger.account.getAccount({ accountId });
      return true;
    } catch (e) {
      return false;
    }
  }
}
