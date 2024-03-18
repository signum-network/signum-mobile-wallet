import { type Ledger, LedgerClientFactory } from "@signumjs/core";
import { type LedgerServiceContext } from "./ledgerServiceContext";
import { AccountService } from "./accountService";

export class LedgerService {
  private readonly ledger: Ledger;

  private readonly accountService: AccountService;

  constructor(private nodeHost: string) {
    this.ledger = LedgerClientFactory.createClient({
      nodeHost,
    });

    const context: LedgerServiceContext = {
      ledger: this.ledger,
    };

    this.accountService = new AccountService(context);
  }

  get ledgerInstance() {
    return this.ledger;
  }

  get host() {
    return this.nodeHost;
  }

  get account(): AccountService {
    return this.accountService;
  }
}
