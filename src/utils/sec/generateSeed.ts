import { PassPhraseGenerator } from "@signumjs/crypto";
import * as Crypto from "expo-crypto";

export const generateSeed = async () => {
  const byteArray = await Crypto.getRandomBytesAsync(1024).then((data) => data);
  Crypto.getRandomValues(byteArray);

  const generator = new PassPhraseGenerator();
  const words = await generator.generatePassPhrase(Array.from(byteArray));
  return words.join(" ");
};

export const pickRandomKeySeedIndex = () => {
  const min = 1;
  const max = 12;

  return Math.floor(Math.random() * (max - min + 1)) + min;
};
