import * as SecureStore from "expo-secure-store";

// If you want to learn why i picked WHEN_UNLOCKED_THIS_DEVICE_ONLY, Take a look here
// https://developer.apple.com/documentation/security/keychain_services/keychain_items/restricting_keychain_item_accessibility
// https://developer.apple.com/documentation/security/ksecattraccessiblewhenunlockedthisdeviceonly/

export const options = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  requireAuthentication: false,
};
