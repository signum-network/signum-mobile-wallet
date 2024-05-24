import { useQuery } from "@tanstack/react-query";
import { useAccount } from "@/hooks/useAccount";
import { useAccountStore } from "@/hooks/useAccountStore";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";
import { useLedgerService } from "@/hooks/useLedgerService";
import { getBalancesFromAccount } from "@/utils/account/getBalancesFromAccount";

export const AccountInitializer = () => {
  const { ledgerService } = useLedgerService();
  const { isActiveNodeSynced, currentNetwork } = useNodeHostStore();
  const { isAuthenticated, publicKey, accountId } = useAccount();
  const { updateAccountActivationStatus, updateAccountData } =
    useAccountStore();

  useQuery({
    queryKey: ["fetchAccount", publicKey, currentNetwork],
    queryFn: async () => {
      if (!ledgerService) return false;

      try {
        const {
          name,
          description,
          balanceNQT,
          unconfirmedBalanceNQT,
          committedBalanceNQT,
        } = await ledgerService.account.fetchAccount(accountId, true);

        const balance = getBalancesFromAccount(
          balanceNQT,
          unconfirmedBalanceNQT,
          committedBalanceNQT
        );

        updateAccountData(publicKey, currentNetwork, {
          isSecured: true,
          name: name || "",
          description: description || "",
          balance,
        });

        return true;
      } catch (error: any) {
        if (
          error.message === "incorrectAccount" ||
          error.message === "unknownAccount"
        ) {
          updateAccountActivationStatus(publicKey, currentNetwork, false);
        }

        return false;
      }
    },
    refetchInterval: 60_000,
    staleTime: 60_000,
    enabled: isAuthenticated && isActiveNodeSynced && !!ledgerService,
  });

  return null;
};
