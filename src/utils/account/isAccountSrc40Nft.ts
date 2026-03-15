import type {Account} from "@signumjs/core";

/**
 * (Fast) Check if account is NFT
 * @param account
 */
export function isAccountSrc40Nft(account: Account) {
    return account.isAT && account.name ===  "NFTSRC40";
}
