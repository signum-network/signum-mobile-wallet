// Constant of global keys available for public

export const PUBLIC_PIN_LENGTH = 6;

export const PUBLIC_PIN_MAX_ATTEMPTS = 5;

export const PUBLIC_PIN_HASH_ITERATIONS = 1_000;

export const PUBLIC_INACTIVITY_AUTO_LOCK = 30_000;

export const PUBLIC_SIGNUM_PUBLIC_RESOURCES_URL =
  "https://signum-network.github.io/public-resources";

export const PUBLIC_SIGNUM_ACCOUNT_ACTIVATOR_MAINNET_URL =
  "https://signum-account-activator.vercel.app";

export const PUBLIC_SIGNUM_ACCOUNT_ACTIVATOR_TESTNET_URL =
  "https://signum-account-activator-ohager.vercel.app";

export const PUBLIC_SIGNUM_AVERAGE_BLOCK_TIME_IN_MILLISECONDS = 240_000;

export const PUBLIC_SIGNUM_AVERAGE_BLOCK_TIME_IN_MINUTES =
  PUBLIC_SIGNUM_AVERAGE_BLOCK_TIME_IN_MILLISECONDS / 60000;

export const PUBLIC_SIGNUM_FETCH_ACCOUNT_DATA_INTERVAL = 60_000;

export const PUBLIC_SIGNUM_COMMITMMENT_HEIGHT_DEADLINE = 1440;

export const PUBLIC_SIGNUM_EXPLORER_MAINNET_URL =
  "https://explorer.signum.network";

export const PUBLIC_SIGNUM_EXPLORER_TESTNET_URL =
  "https://t-chain.signum.network";

export const PUBLIC_CURRENT_OS = process.env.EXPO_OS as "ios" | "android";

export const PUBLIC_IPFS_GATEWAY = "https://ipfs.io/ipfs";

// Constants of predefined keys for Expo Secure Store

export const SECURE_STORE_PIN_KEY = "PIN_KEY";

export const SECURE_STORE_PIN_SALT = "PIN_SALT";
