import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard } from "react-native";
import { router } from "expo-router";
import { useAppStore } from "@/hooks/useAppStore";
import { PinAuthenticator } from "@/features/Auth/components/PinAuthenticator";
import { PUBLIC_PIN_LENGTH } from "@/types/constants";
import * as LocalAuthentication from "expo-local-authentication";

const initialValues = [...new Array(PUBLIC_PIN_LENGTH)];

export const LoginAuthScreen = () => {
  const { t } = useTranslation();
  const { authMethod } = useAppStore();

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [value, setValues] = useState<string[]>(initialValues);

  const resetValues = () => setValues(initialValues);

  const handleOnChangeValues = async (values: string[], submit: boolean) => {
    setValues(values);

    if (submit) {
      const formatedValues = values.join("");
      const isValidPin = formatedValues === "220492";
      setSuccess(isValidPin);

      setError(!isValidPin ? true : false);
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
    />
  );
};
