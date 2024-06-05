import {
  PUBLIC_SIGNUM_EXPLORER_MAINNET_URL,
  PUBLIC_SIGNUM_EXPLORER_TESTNET_URL,
} from "@/types/constants";
import { nodeHostStore } from "@/states/nodeHostStore";

export const getExplorerUrl = () => {
  const isTestnet = nodeHostStore.getState().activeNodeHost.isTestnet;

  return isTestnet
    ? PUBLIC_SIGNUM_EXPLORER_TESTNET_URL
    : PUBLIC_SIGNUM_EXPLORER_MAINNET_URL;
};
