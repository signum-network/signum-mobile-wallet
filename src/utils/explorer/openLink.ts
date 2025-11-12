import { getExplorerUrl } from "./getExplorerUrl";
import * as Linking from "expo-linking";

export const openTransactionLink = async (transactionId: string) => {
  await Linking.openURL(`${getExplorerUrl()}/tx/${transactionId}`);
};

export const openAddressLink = async (accountId: string) => {
  await Linking.openURL(`${getExplorerUrl()}/address/${accountId}`);
};

export const openTokenLink = async (tokenId: string) => {
  await Linking.openURL(`${getExplorerUrl()}/asset/${tokenId}`);
};
