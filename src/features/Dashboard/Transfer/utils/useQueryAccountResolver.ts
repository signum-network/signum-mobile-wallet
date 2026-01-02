import {useNodeHostStore} from "@/hooks/useNodeHostStore";
import {useLedgerService} from "@/hooks/useLedgerService";
import {useQuery} from "@tanstack/react-query";
import {Address} from "@signumjs/core";

/**
 * Tries to resolve various input strings to account
 * @param accountString
 */
export const useQueryAccountResolver = (accountString: string) => {
    const {currentNetwork} = useNodeHostStore()
    const {ledgerService} = useLedgerService()
    const {data: account, isLoading, error} = useQuery({
            queryKey: ['resolveAccount', accountString, currentNetwork],
            queryFn: async () => {
                if (!ledgerService) return null;

                // check if account string is a valid address
                // if not, try to check as alias
                let resolvedAccountId = "";
                let aliasName = "";
                try {
                    resolvedAccountId = Address.create(accountString).getNumericId()

                } catch {
                    try {
                        resolvedAccountId = await ledgerService.alias.resolveAliasToAccountId(accountString)
                        aliasName = accountString;
                    } catch {
                        // noop
                    }
                }
                if (resolvedAccountId === "") return null;
                const account = await ledgerService.account.fetchAccount(resolvedAccountId)
                return {...account, aliasName}
            },
            enabled: Boolean(accountString) && accountString.length > 2  && accountString !== "0" && Boolean(ledgerService),
        }
    )

    return {account, isLoading, error}
}
