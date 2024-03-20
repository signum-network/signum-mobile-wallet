import * as SecureStore from "expo-secure-store";
import { generateMasterKeys } from "@signumjs/crypto";
import { options } from "./storageOptions";

export const generateSecretKeys = (seed: string) => {
  const { publicKey, agreementPrivateKey, signPrivateKey } =
    generateMasterKeys(seed);

  return { publicKey, agreementPrivateKey, signPrivateKey };
};

export const saveSecretKey = async (
  publicKey: string,
  signPrivateKey: string,
  agreementPrivateKey: string
) => {
  try {
    return await SecureStore.setItemAsync(
      publicKey,
      JSON.stringify({ signPrivateKey, agreementPrivateKey }),
      options
    ).then(() => true);
  } catch (error) {
    console.error(error);
  }
};

export const readSecretKey = async (
  publicKey: string
): Promise<
  { signPrivateKey: string; agreementPrivateKey: string } | undefined
> => {
  try {
    return await SecureStore.getItemAsync(publicKey, options).then(
      (data: any) => {
        const { signPrivateKey, agreementPrivateKey } = JSON.parse(data);
        return { signPrivateKey, agreementPrivateKey };
      }
    );
  } catch (error) {
    console.error(error);
  }
};

export const deleteSecretKey = async (publicKey: string) => {
  try {
    return await SecureStore.deleteItemAsync(publicKey, options).then(
      () => true
    );
  } catch (error) {
    console.error(error);
    return false;
  }
};
