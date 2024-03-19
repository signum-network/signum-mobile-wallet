import * as bip39 from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";

export const generateSeed = async () => {
  try {
    return bip39.generateMnemonic(wordlist, 256);
  } catch (error) {
    console.error(error);
  }
};

export const pickRandomKeySeedIndex = () => {
  const min = 1;
  const max = 24;

  return Math.floor(Math.random() * (max - min + 1)) + min;
};
