import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard } from "react-native";
import { router } from "expo-router";
import { useAppStore } from "@/hooks/useAppStore";
import { PinAuthenticator } from "@/features/Auth/components/PinAuthenticator";
import {
  PUBLIC_PIN_LENGTH,
  SECURE_STORE_PIN_SALT,
  SECURE_STORE_PIN_KEY,
} from "@/types/constants";
import { generateHash } from "@/utils/sec/generateHash";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";

const initialValues = [...new Array(PUBLIC_PIN_LENGTH)];

export const LoginAuthScreen = () => {
  const { t } = useTranslation();
  const { authMethod } = useAppStore();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [value, setValues] = useState<string[]>(initialValues);

  const resetValues = () => setValues(initialValues);

  const goToEnrollScreen = () => router.replace("/auth/enroll");

  const handleOnChangeValues = async (values: string[], submit: boolean) => {
    setValues(values);
    setError(false);

    if (submit) {
      setLoading(true);
      const formatedValues = values.join("");
      const salt = await SecureStore.getItemAsync(SECURE_STORE_PIN_SALT);
      const key = await SecureStore.getItemAsync(SECURE_STORE_PIN_KEY);

      if (!salt || !key) return goToEnrollScreen();

      const tryHash = await generateHash(formatedValues, salt);

      if (!tryHash) return goToEnrollScreen();

      const isValidPin = key === tryHash.key;
      setSuccess(isValidPin);
      setError(!isValidPin);

      if (!isValidPin) setLoading(false);
    }
  };

  const requestHardwareAuth = () => {
    LocalAuthentication.authenticateAsync({
      cancelLabel: t("cancel"),
      disableDeviceFallback: true,
      promptMessage: t("auth.verifyItsYou"),
    }).then(({ success }) => {
      setSuccess(success);
      Keyboard.dismiss();
    });
  };

  const onSuccess = () => {
    const areAllFieldsFilled = value.join("").length === PUBLIC_PIN_LENGTH;

    // This timeout is here because of the success sound feedback :D, the tone lasts 3 seconds
    // As UX practice, if user logs in with hardware auth, the tone will not sound, because user want to log in quick
    setTimeout(
      () => {
        router.replace("/account-wizard/");
      },
      areAllFieldsFilled ? 2700 : 1000
    );
  };

  useEffect(() => {
    if (success && !error) onSuccess();
  }, [success, error]);

  useEffect(() => {
    if (authMethod === "BIOMETRIC") requestHardwareAuth();
  }, [authMethod]);

  return (
    <PinAuthenticator
      label={t("auth.loginPassCodeTitle")}
      complementaryLabel={t("auth.loginPassCodeDescription")}
      errorLabel={t("auth.verifyIncorrectPassCode")}
      successLabel={`${t("auth.loginCorrectPassCode")} 😊`}
      error={error}
      success={success}
      length={PUBLIC_PIN_LENGTH}
      value={value}
      onChange={handleOnChangeValues}
      onReset={resetValues}
      disabled={loading}
    />
  );
};
