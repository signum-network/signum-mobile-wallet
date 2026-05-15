import * as SecureStore from "expo-secure-store";
import { SECURE_STORE_AUTH_ATTEMPTS_KEY } from "@/types/constants";
import { options } from "./storageOptions";

export const saveAuthAttempts = (count: number) =>
    SecureStore.setItemAsync(SECURE_STORE_AUTH_ATTEMPTS_KEY, String(count), options);

export const readAuthAttempts = async (): Promise<number> => {
    const value = await SecureStore.getItemAsync(SECURE_STORE_AUTH_ATTEMPTS_KEY, options);
    return value ? parseInt(value, 10) : 0;
};

export const deleteAuthAttempts = () =>
    SecureStore.deleteItemAsync(SECURE_STORE_AUTH_ATTEMPTS_KEY, options);
