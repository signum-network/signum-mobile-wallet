import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, Keyboard } from "react-native";
import { router } from "expo-router";
import { useAppStore } from "@/hooks/useAppStore";
import { PinAuthenticator } from "@/features/Auth/components/PinAuthenticator";
import { PUBLIC_PIN_MAX_ATTEMPTS, PUBLIC_PIN_LENGTH } from "@/types/constants";
import { generateHash } from "@/utils/sec/generateHash";
import { readPin } from "@/utils/sec/handlePin";
import { useAccountStore } from "@/hooks/useAccountStore";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useResetApp } from "@/hooks/useResetApp";
import * as LocalAuthentication from "expo-local-authentication";
import { recipientsStore } from "@/states/recipientsStore";
import {ResetWalletDialog} from "@/features/Dashboard/Settings/Home/components/ResetWalletDialog";

const initialValues = [...new Array(PUBLIC_PIN_LENGTH)];

export const LoginAuthScreen = () => {
  const { t } = useTranslation();
  const { isAccountEnrolled } = useAccountStore();
  const {
    authMethod,
    failedAuthAttempts,
    setFailedAuthAttempts,
  } = useAppStore();

  const { tokens } = useAppTheme();

  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [value, setValues] = useState<string[]>(initialValues);

  const { resetApp } = useResetApp({
    onSuccess: () => {
      alert(t("resetApp"));
    },
  });

  const resetValues = () => setValues(initialValues);

  const goToEnrollScreen = () => router.replace("/auth/enroll");

  const handleOnChangeValues = async (values: string[], submit: boolean) => {
    setValues(values);
    setError(false);

    if (submit) {
      setLoading(true);
      const formatedValues = values.join("");
      const storedPinData = await readPin();

      if (!storedPinData) return goToEnrollScreen();

      const { key, salt } = storedPinData;

      const tryHash = await generateHash(formatedValues, salt);

      if (!tryHash) return goToEnrollScreen();

      const isValidPin = key === tryHash.key;

      if (isValidPin) {
        setSuccess(true);
      } else {
        setLoading(false);
        setError(true);
        setFailedAuthAttempts(failedAuthAttempts + 1);
      }
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
    setFailedAuthAttempts(0);

    recipientsStore.getState().purgeExpired();

    setTimeout(
      () => {
        if (!isAccountEnrolled) {
          router.replace("/account-wizard");
        } else {
          router.replace("/dashboard/overview");
        }
      },
      areAllFieldsFilled ? 1000 : 1000
    );
  };

  const handleResetApp = async () => {
    setLocked(true);
    Keyboard.dismiss();
    await resetApp();
  };

  useEffect(() => {
    if (success && !error) onSuccess();
  }, [success, error]);

  useEffect(() => {
    if (authMethod === "BIOMETRIC") requestHardwareAuth();
  }, [authMethod]);

  useEffect(() => {
    if (failedAuthAttempts === PUBLIC_PIN_MAX_ATTEMPTS) {
      handleResetApp();
    } else if (failedAuthAttempts >= PUBLIC_PIN_MAX_ATTEMPTS - 2) {
      alert(
        t("auth.loginPassCodeTooManyAttempts", {
          count: PUBLIC_PIN_MAX_ATTEMPTS - failedAuthAttempts,
        })
      );
    }
  }, [failedAuthAttempts]);

  return (
    <View
      className="flex-1 items-center justify-between pt-24 pb-8 px-4"
      style={{
        backgroundColor: tokens.background,
      }}
    >
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
        disabled={loading || locked}
      />
        <ResetWalletDialog variant="ghost" />
    </View>
  );
};
