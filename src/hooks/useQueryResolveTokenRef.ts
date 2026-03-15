import {useQuery} from "@tanstack/react-query";
import {useNodeHostStore} from "@/hooks/useNodeHostStore";
import {useLedgerService} from "@/hooks/useLedgerService";

export function useQueryResolveTokenRef(refHash: string) {
    const {currentNetwork} = useNodeHostStore()
    const {ledgerService} = useLedgerService()

    const {data: token, isLoading, error} = useQuery({
        queryKey: ["resolveTokenReferenceHash", refHash, currentNetwork],
        queryFn: async () => {
            if (!ledgerService) return;
            if (!refHash) return;
            return ledgerService.token.fetchTokenByRef(refHash)
        },
        staleTime: Infinity,
        enabled: Boolean(ledgerService) && Boolean(refHash)
    })

    return {
        token,
        isLoading,
        error
    }

}
