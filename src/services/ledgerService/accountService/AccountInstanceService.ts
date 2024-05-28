import type { DistributionAmount } from "@signumjs/core";
import type { LedgerServiceContext } from "../ledgerServiceContext";
import { LedgerSubService } from "../ledgerSubService";
import { handleError } from "../handleError";

export class AccountInstanceService extends LedgerSubService {
  constructor(private accountId: string, context: LedgerServiceContext) {
    super(context);
  }

  fetchTransactionDistributionAmount(
    transactionId: string
  ): Promise<DistributionAmount> {
    return handleError(async () =>
      this.context.ledger.transaction.getDistributionAmountsFromTransaction(
        transactionId,
        this.accountId
      )
    );
  }
}
