import { useQuery } from "@tanstack/react-query";
import { useAccount } from "@/hooks/useAccount";
import { useAccountStore } from "@/hooks/useAccountStore";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";
import { useLedgerService } from "@/hooks/useLedgerService";
import { getBalancesFromAccount } from "@/utils/account/getBalancesFromAccount";

export const AccountInitializer = () => {
  const { ledgerService } = useLedgerService();
  const { isActiveNodeSynced } = useNodeHostStore();
  const { isAuthenticated, publicKey, accountNetwork, accountId } =
    useAccount();
  const { updateAccountActivationStatus, updateAccountData } =
    useAccountStore();

  useQuery({
    queryKey: ["fetchAccount", publicKey, accountNetwork],
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

        updateAccountData(publicKey, accountNetwork, {
          isSecured: true,
          name: name || "",
          description: description || "",
          balance,
        });

        return true;
      } catch (error: any) {
        if (error.message === "incorrectAccount") {
          updateAccountActivationStatus(publicKey, accountNetwork, false);
        }

        return false;
      }
    },
    refetchInterval: 30_000,
    staleTime: 30_000,
    enabled: isAuthenticated && isActiveNodeSynced && !!ledgerService,
  });

  return null;
};
