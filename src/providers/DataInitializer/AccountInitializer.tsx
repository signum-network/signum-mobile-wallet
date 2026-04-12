import { useQuery } from "@tanstack/react-query";
import { useWalletAccount } from "@/hooks/useWalletAccount";
import { useAccountStore } from "@/hooks/useAccountStore";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";
import { useLedgerService } from "@/hooks/useLedgerService";
import { getBalancesFromAccount } from "@/utils/account/getBalancesFromAccount";
import { getTokenBalancesFromAccount } from "@/utils/account/getTokenBalancesFromAccount";
import {
  PUBLIC_SIGNUM_FETCH_ACCOUNT_DATA_INTERVAL,
  PUBLIC_SIGNUM_FETCH_ACCOUNT_DATA_INTERVAL_WHILE_ACTIVATING,
} from "@/types/constants";

export const AccountInitializer = () => {
  const { ledgerService } = useLedgerService();
  const { isActiveNodeSynced, currentNetwork } = useNodeHostStore();
  const {
    isAuthenticated,
    publicKey,
    accountId,
    accountData: { activationInProgress },
  } = useWalletAccount();
  const { updateAccountActivationStatus, updateAccountData } =
    useAccountStore();

  const pollInterval = activationInProgress
    ? PUBLIC_SIGNUM_FETCH_ACCOUNT_DATA_INTERVAL_WHILE_ACTIVATING
    : PUBLIC_SIGNUM_FETCH_ACCOUNT_DATA_INTERVAL;

  useQuery({
    queryKey: ["fetchAccount", publicKey, currentNetwork],
    queryFn: async () => {
      if (!ledgerService) return;

      try {
        const {
          name,
          description,
          balanceNQT,
          unconfirmedBalanceNQT,
          committedBalanceNQT,
          assetBalances,
          unconfirmedAssetBalances,
        } = await ledgerService.account.fetchAccount(accountId, true);

        const balance = getBalancesFromAccount(
          balanceNQT,
          unconfirmedBalanceNQT,
          committedBalanceNQT
        );

        const tokenBalance = getTokenBalancesFromAccount(
          assetBalances || [],
          unconfirmedAssetBalances || []
        );

        updateAccountData(publicKey, currentNetwork, {
          loading: false,
          isSecured: true,
          activationInProgress: false,
          name: name || "",
          description: description || "",
          balance,
          tokenBalance,
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
    refetchInterval: pollInterval,
    staleTime: pollInterval,
    enabled: isAuthenticated && isActiveNodeSynced && !!ledgerService,
  });

  return null;
};
