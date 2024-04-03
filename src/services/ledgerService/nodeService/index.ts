import { type LedgerServiceContext } from "../ledgerServiceContext";
import { LedgerSubService } from "../ledgerSubService";
import { handleError } from "../handleError";

export class NodeService extends LedgerSubService {
  constructor(context: LedgerServiceContext) {
    super(context);
  }

  fetchNetworkInfo() {
    return handleError(async () =>
      this.context.ledger.network.getNetworkInfo()
    );
  }

  fetchBlockchainStatus() {
    return handleError(async () =>
      this.context.ledger.network.getBlockchainStatus()
    );
  }
}
