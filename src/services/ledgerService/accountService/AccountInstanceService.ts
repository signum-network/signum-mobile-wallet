import type { GetAccountTransactionsArgs } from "@signumjs/core";
import type { LedgerServiceContext } from "../ledgerServiceContext";
import { LedgerSubService } from "../ledgerSubService";
import { handleError } from "../handleError";

export class AccountInstanceService extends LedgerSubService {
  constructor(private accountId: string, context: LedgerServiceContext) {
    super(context);
  }

  fetchTransactions({
    firstIndex,
    lastIndex,
    includeIndirect,
  }: Omit<GetAccountTransactionsArgs, "accountId">) {
    return handleError(async () =>
      this.context.ledger.account.getAccountTransactions({
        accountId: this.accountId,
        firstIndex,
        lastIndex,
        includeIndirect,
      })
    );
  }

  fetchPendingTransactions(includeIndirect?: boolean) {
    return handleError(async () =>
      this.context.ledger.account.getUnconfirmedAccountTransactions(
        this.accountId,
        includeIndirect
      )
    );
  }

  fetchTransactionDistributionAmount(transactionId: string) {
    return handleError(async () =>
      this.context.ledger.transaction.getDistributionAmountsFromTransaction(
        transactionId,
        this.accountId
      )
    );
  }
}
