import { generateMnemonic } from "@signumjs/crypto";

export const generateSeed = () => {
  return generateMnemonic();
};

export const pickRandomKeySeedIndex = () => {
  const min = 1;
  const max = 7; //18

  return Math.floor(Math.random() * (max - min + 1)) + min;
};
