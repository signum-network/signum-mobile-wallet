import * as SecureStore from "expo-secure-store";
import { SECURE_STORE_PIN_KEY, SECURE_STORE_PIN_SALT } from "@/types/constants";

// If you want to learn why i picked WHEN_UNLOCKED_THIS_DEVICE_ONLY, Take a look here
// https://developer.apple.com/documentation/security/keychain_services/keychain_items/restricting_keychain_item_accessibility
// https://developer.apple.com/documentation/security/ksecattraccessiblewhenunlockedthisdeviceonly/

const options = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  requireAuthentication: false,
};

export const savePin = async (key: string, salt: string) => {
  try {
    return Promise.all([
      await SecureStore.setItemAsync(SECURE_STORE_PIN_KEY, key, options),
      await SecureStore.setItemAsync(SECURE_STORE_PIN_SALT, salt, options),
    ]).then(() => true);
  } catch (error) {
    console.error(error);
  }
};

export const readPin = async () => {
  try {
    return Promise.all([
      await SecureStore.getItemAsync(SECURE_STORE_PIN_KEY, options),
      await SecureStore.getItemAsync(SECURE_STORE_PIN_SALT, options),
    ]).then((data) => {
      if (!data[0] || !data[1]) return undefined;
      return { key: data[0], salt: data[1] };
    });
  } catch (error) {
    console.error(error);
  }
};

export const deletePin = async () => {
  try {
    return Promise.all([
      await SecureStore.deleteItemAsync(SECURE_STORE_PIN_KEY, options),
      await SecureStore.deleteItemAsync(SECURE_STORE_PIN_SALT, options),
    ]).then(() => true);
  } catch (error) {
    console.error(error);
  }
};
