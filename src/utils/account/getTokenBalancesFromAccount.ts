import type { AssetBalance, UnconfirmedAssetBalance } from "@signumjs/core";
import type { TokenBalance } from "@/types/account";

export const getTokenBalancesFromAccount = (
  assetBalances: AssetBalance[],
  unconfirmedAssetBalances: UnconfirmedAssetBalance[]
): TokenBalance[] => {
  const balances: TokenBalance[] = assetBalances.map((asset, index) => ({
    asset: asset.asset,
    balanceQNT: asset.balanceQNT,
    unconfirmedBalanceQNT:
      unconfirmedAssetBalances[index].unconfirmedBalanceQNT ?? "0",
  }));

  return balances;
};
