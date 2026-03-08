import * as SecureStore from "expo-secure-store";
import { generateSignKeys } from "@signumjs/crypto";
import { options } from "./storageOptions";

export const generateSecretKeys = (seed: string) => {
  const { publicKey, agreementPrivateKey, signPrivateKey } =
    generateSignKeys(seed);

  return { publicKey, agreementPrivateKey, signPrivateKey };
};

export const saveSecretKey = async (
  publicKey: string,
  signPrivateKey: string,
  agreementPrivateKey: string
) => {
  try {
    await SecureStore.setItemAsync(
      publicKey,
      JSON.stringify({ signPrivateKey, agreementPrivateKey }),
      options
    );
    return true;
  } catch (error) {
    console.error("Error while saving key:", error);
  }
};

export const readSecretKey = async (
  publicKey: string
): Promise<
  { signPrivateKey: string; agreementPrivateKey: string } | undefined
> => {
  try {
    const data = await SecureStore.getItemAsync(publicKey, options);
    const { signPrivateKey, agreementPrivateKey } = JSON.parse(data!);
    return { signPrivateKey, agreementPrivateKey };
  } catch (error) {
    console.error("Error while reading key:", error);
  }
};

export const deleteSecretKey = async (publicKey: string) => {
  try {
    console.log("Deleting key:", publicKey);
    await SecureStore.deleteItemAsync(publicKey, options);
    return true;
  } catch (error) {
    console.error("Error while deleting key:", error);
    return false;
  }
};
