import {
  PUBLIC_PIN_HASH_ITERATIONS,
} from "@/types/constants";
import { Buffer } from "buffer/"; // Note: the trailing slash is important!
import crypto from 'react-native-quick-crypto';

const HASH_VERSION_PREFIX = 'v2:';

export const isLegacyHash = (key: string) => !key.startsWith(HASH_VERSION_PREFIX);

export const generateHash = async (secret: string, saltBase64?: string) => {
    const salt = saltBase64 ? new Uint8Array(Buffer.from(saltBase64, "base64")) : crypto.randomBytes(32);
    const result = crypto.pbkdf2Sync(secret, salt, PUBLIC_PIN_HASH_ITERATIONS, 32, 'sha512');
    return {
        salt: Buffer.from(salt).toString("base64"),
        key: `${HASH_VERSION_PREFIX}${result.toString("base64")}`,
    };
}

// Verifies a pre-v2 SHA-1 hash (react-native-quick-crypto <1.1.0 silent default)
export const verifyLegacyHash = (secret: string, saltBase64: string, storedKey: string) => {
    const salt = new Uint8Array(Buffer.from(saltBase64, "base64"));
    const result = crypto.pbkdf2Sync(secret, salt, PUBLIC_PIN_HASH_ITERATIONS, 32, 'sha1');
    return storedKey === result.toString("base64");
};


