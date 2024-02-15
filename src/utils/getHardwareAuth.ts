import * as LocalAuthentication from "expo-local-authentication";

export const getHardwareAuth = async () => {
  const hasHardwareAsync = await LocalAuthentication.hasHardwareAsync();
  const isEnrolledAsync = await LocalAuthentication.isEnrolledAsync();
  const enrolledLevelAsync = await LocalAuthentication.getEnrolledLevelAsync();
  const supportedAuthenticationTypesAsync =
    await LocalAuthentication.supportedAuthenticationTypesAsync();

  const canUseHardwareAuth = !!(
    hasHardwareAsync &&
    isEnrolledAsync &&
    enrolledLevelAsync === LocalAuthentication.SecurityLevel.BIOMETRIC &&
    supportedAuthenticationTypesAsync.length
  );

  return {
    canUseHardwareAuth,
    hasHardwareAsync,
    isEnrolledAsync,
    enrolledLevelAsync,
    supportedAuthenticationTypesAsync,
  };
};
