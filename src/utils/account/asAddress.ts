import { nodeHostStore } from "@/states/nodeHostStore";
import { Address, AddressPrefix } from "@signumjs/core";

export const asAddress = (accountId: string): Address => {
  const isTestnet = nodeHostStore.getState().activeNodeHost.isTestnet;

  const Prefix = isTestnet ? AddressPrefix.TestNet : AddressPrefix.MainNet;

  return Address.create(accountId, Prefix);
};
