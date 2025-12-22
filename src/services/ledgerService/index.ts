import { type Ledger, LedgerClientFactory } from "@signumjs/core";
import type { LedgerServiceContext } from "./ledgerServiceContext";
import { AccountService } from "./accountService";
import { NodeService } from "./nodeService";
import { TokenService } from "./tokenService";

export class LedgerService {
  private readonly ledger: Ledger;
  private readonly accountService: AccountService;
  private readonly nodeService: NodeService;
  private readonly tokenService: TokenService;

  constructor(private nodeHost: string) {
    this.ledger = LedgerClientFactory.createClient({
      nodeHost,
    });

    const context: LedgerServiceContext = {
      ledger: this.ledger,
    };

    this.accountService = new AccountService(context);
    this.nodeService = new NodeService(context);
    this.tokenService = new TokenService(context);
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

  get node(): NodeService {
    return this.nodeService;
  }

  get token(): TokenService {
    return this.tokenService;
  }
}
