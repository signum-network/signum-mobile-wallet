import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard } from "react-native";
import { router } from "expo-router";
import { useAppStore } from "@/hooks/useAppStore";
import { PinAuthenticator } from "@/features/Auth/components/PinAuthenticator";
import { PUBLIC_PIN_MAX_ATTEMPTS, PUBLIC_PIN_LENGTH } from "@/types/constants";
import { AccountType } from "@/types/account";
import { generateHash } from "@/utils/sec/generateHash";
import { readPin, deletePin } from "@/utils/sec/handlePin";
import { deleteSecretKey } from "@/utils/sec/handleSecretKeys";
import { useAccountStore } from "@/hooks/useAccountStore";
import * as LocalAuthentication from "expo-local-authentication";

const initialValues = [...new Array(PUBLIC_PIN_LENGTH)];

export const LoginAuthScreen = () => {
  const { t } = useTranslation();
  const { accounts, isAccountEnrolled, resetAccountStore } = useAccountStore();
  const {
    authMethod,
    failedAuthAttempts,
    setFailedAuthAttempts,
    resetAppStore,
  } = useAppStore();

  const [locked, setLocked] = useState(false);
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

    // This timeout is here because of the success sound feedback :D, the tone lasts 3 seconds
    // As UX practice, if user logs in with hardware auth, the tone will not sound, because user want to log in quick
    setTimeout(
      () => {
        if (!isAccountEnrolled) router.replace("/account-wizard/");

        router.replace("/(dashboard)/overview");
      },
      areAllFieldsFilled ? 2700 : 1000
    );
  };

  // Reset app settings
  // Reset account store
  // Delete account secret keys from secure storage
  const resetApp = () => {
    setLocked(true);

    alert(t("resetApp"));

    Keyboard.dismiss();

    const promises: Promise<boolean>[] = [];

    Object.values(accounts).forEach((account) => {
      if (account.type === AccountType.mnemonic) {
        promises.push(deleteSecretKey(account.publicKey));
      }
    });

    deletePin().then(() => {
      resetAppStore();

      Promise.allSettled(promises).then((data) => {
        resetAccountStore();

        // Timeout is applied because error audio must finish, otherwise app will break
        setTimeout(() => {
          router.replace("/terms");
        }, 3000);
      });
    });
  };

  useEffect(() => {
    if (success && !error) onSuccess();
  }, [success, error]);

  useEffect(() => {
    if (authMethod === "BIOMETRIC") requestHardwareAuth();
  }, [authMethod]);

  useEffect(() => {
    if (failedAuthAttempts === PUBLIC_PIN_MAX_ATTEMPTS) {
      resetApp();
    } else if (failedAuthAttempts >= PUBLIC_PIN_MAX_ATTEMPTS - 2) {
      alert(
        t("auth.loginPassCodeTooManyAttempts", {
          count: PUBLIC_PIN_MAX_ATTEMPTS - failedAuthAttempts,
        })
      );
    }
  }, [failedAuthAttempts]);

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
      disabled={loading || locked}
    />
  );
};
