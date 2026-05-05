import {
  PUBLIC_PIN_HASH_ITERATIONS,
} from "@/types/constants";
import { Buffer } from "buffer/"; // Note: the trailing slash is important!
import crypto from 'react-native-quick-crypto';


export const generateHash = async (secret: string, saltBase64?: string) => {

    let salt =  saltBase64 ? new Uint8Array(Buffer.from(saltBase64, "base64")) : crypto.randomBytes(32);
    const result = crypto.pbkdf2Sync(secret, salt, PUBLIC_PIN_HASH_ITERATIONS, 32, 'sha256')
    {
        return {
            salt: Buffer.from(salt).toString("base64"),
            key: result.toString("base64"),
        };
    }
}


