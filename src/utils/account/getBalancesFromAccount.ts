import { Amount } from "@signumjs/util";

export function getBalancesFromAccount(
  balanceNQT: string,
  unconfirmedBalanceNQT: string,
  committedBalanceNQT: string
) {
  const totalBalance = Amount.fromPlanck(balanceNQT || "0");

  const availableBalance = Amount.fromPlanck(unconfirmedBalanceNQT || "0");
  const lockedBalance = totalBalance.clone().subtract(availableBalance);

  const committedBalance = Amount.fromPlanck(committedBalanceNQT || "0");
  const reservedBalance = lockedBalance.clone().subtract(committedBalance);

  return {
    availableBalance,
    committedBalance,
    reservedBalance,
    totalBalance,
  };
}
