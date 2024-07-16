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

  fetchLastBlockFound() {
    return handleError(async () =>
      this.context.ledger.account
        .getAccountBlocks({
          accountId: this.accountId,
          firstIndex: 0,
          lastIndex: 0,
          includeTransactions: false,
        })
        .then((data) => data.blocks[0] ?? undefined)
    );
  }

  fetchLastAddCommitmentTransaction() {
    return handleError(async () =>
      this.context.ledger.account
        .getAccountTransactions({
          accountId: this.accountId,
          firstIndex: 0,
          lastIndex: 0,
          type: 20, // Mining-related transactions
          subtype: 1, // Add commitment sub-type
        })
        .then((data) => data.transactions[0] ?? undefined)
    );
  }
}
