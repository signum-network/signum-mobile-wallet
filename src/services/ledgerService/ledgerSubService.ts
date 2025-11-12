import { LedgerServiceContext } from "./ledgerServiceContext";
import { FeeType } from "@/types/feeType";
import { Amount } from "@signumjs/util";

export class LedgerSubService {
  constructor(protected context: LedgerServiceContext) {}

  protected withCurrentNetworkFees<T = string>(
    fn: (fees: FeeType) => Promise<T>,
    feeOverride?: Amount
  ) {
    return async () => {
      let fees: FeeType = {
        cheap: 1000000,
        standard: 2000000,
        priority: 3000000,
      };
      try {
        if (!feeOverride) {
          fees = await this.context.ledger.network.getSuggestedFees();
        } else {
          const feePlanck = parseInt(feeOverride.getPlanck());
          fees = {
            cheap: feePlanck,
            standard: feePlanck,
            priority: feePlanck,
          };
        }
      } catch (e: any) {
        console.warn("withBaseNetworkFees() failed:", e);
        // ignore error...
      }
      return fn(fees);
    };
  }
}
