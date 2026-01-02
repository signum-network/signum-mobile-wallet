import {LedgerSubService} from "@/services/ledgerService/ledgerSubService";
import type {LedgerServiceContext} from "@/services/ledgerService/ledgerServiceContext";
import {src47} from "@signumjs/standards"
import {handleError} from "@/services/ledgerService/handleError";

const {URIResolver} = src47

export class AliasService extends LedgerSubService {
    constructor(context: LedgerServiceContext) {
        super(context);
    }

    /**
     * Resolves an alias to an account id.
     *
     * Alias can be in format: foo.signum, sub.foo.signum, foo.web3, etc
     *
     * [sub.]aliasname[.tld]
     *
     * @param aliasName
     */
    resolveAliasToAccountId(aliasName: string) {
        return handleError(async () => {
            const resolver = new URIResolver(this.context.ledger);
            const accountId = await resolver.resolve(`https://${aliasName}/ac`);
            return accountId as string;
        })
    }
}
