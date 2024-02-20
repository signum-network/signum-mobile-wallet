import * as Crypto from "expo-crypto";
import { PUBLIC_PIN_HASH_ITERATIONS } from "@/types/constants";
import { Buffer } from "buffer/"; // note: the trailing slash is important!

export const stretchKey = async (secret: string) => {
  try {
    const byteSalt = await Crypto.getRandomBytesAsync(1024).then(
      (data) => data
    );

    const byteSecret = new TextEncoder().encode(secret);

    const merged = new Uint8Array(byteSalt.length + byteSecret.length);
    merged.set(byteSalt);
    merged.set(byteSecret, byteSalt.length);

    let hash = await Crypto.digest(Crypto.CryptoDigestAlgorithm.SHA512, merged);

    for (let i = 0; i < PUBLIC_PIN_HASH_ITERATIONS - 1; ++i) {
      hash = await Crypto.digest(
        Crypto.CryptoDigestAlgorithm.SHA512,
        Buffer.from(hash)
      );
    }

    return {
      salt: Buffer.from(byteSalt).toString("base64"),
      key: Buffer.from(hash).toString("base64"),
    };
  } catch (error) {
    console.error(error);
  }
};
