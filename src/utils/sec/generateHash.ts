import * as Crypto from "expo-crypto";
import { PUBLIC_PIN_HASH_ITERATIONS } from "@/types/constants";
import { Buffer } from "buffer/"; // note: the trailing slash is important!

export const generateHash = async (secret: string, saltBase64?: string) => {
  try {
    const byteSalt = saltBase64
      ? new Uint8Array(Buffer.from(saltBase64, "base64"))
      : await Crypto.getRandomBytesAsync(1024).then((data) => data);

    const byteSecret = new TextEncoder().encode(secret);

    const merged = new Uint8Array(byteSalt.length + byteSecret.length);
    merged.set(byteSalt);
    merged.set(byteSecret, byteSalt.length);

    let hash = await Crypto.digest(Crypto.CryptoDigestAlgorithm.SHA512, merged);

    // TODO: Fix iOS issue regarding PIN rehashing
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
