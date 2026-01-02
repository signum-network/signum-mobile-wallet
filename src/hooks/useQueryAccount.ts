import {useLedgerService} from "@/hooks/useLedgerService";
import {useNodeHostStore} from "@/hooks/useNodeHostStore";
import {useQuery} from "@tanstack/react-query";
import {PUBLIC_SIGNUM_AVERAGE_BLOCK_TIME_IN_MILLISECONDS} from "@/types/constants";

/**
 * Fetch account data from the ledger (using tanstack query cache).
 * @param accountId
 */
export function useQueryAccount(accountId: string) {
    const {ledgerService} = useLedgerService();
    const {currentNetwork} = useNodeHostStore()
    return useQuery({
        queryKey: ["fetchAccount", accountId, currentNetwork],
        queryFn: async () => {
            if (!ledgerService) return;
            return await ledgerService.account.fetchAccount(accountId, true)
        },
        staleTime: PUBLIC_SIGNUM_AVERAGE_BLOCK_TIME_IN_MILLISECONDS
    });
}
