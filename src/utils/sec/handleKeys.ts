import * as SecureStore from "expo-secure-store";
import { SECURE_STORE_PIN_KEY, SECURE_STORE_PIN_SALT } from "@/types/constants";

export const savePin = async (key: string, salt: string) => {
  // If you want to learn why i picked WHEN_UNLOCKED_THIS_DEVICE_ONLY, Take a look here
  // https://developer.apple.com/documentation/security/keychain_services/keychain_items/restricting_keychain_item_accessibility
  // https://developer.apple.com/documentation/security/ksecattraccessiblewhenunlockedthisdeviceonly/

  const options = {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    requireAuthentication: false,
  };

  try {
    return Promise.all([
      await SecureStore.setItemAsync(SECURE_STORE_PIN_KEY, key, options),
      await SecureStore.setItemAsync(SECURE_STORE_PIN_SALT, salt, options),
    ]).then(() => true);
  } catch (error) {
    console.error(error);
    return false;
  }
};
