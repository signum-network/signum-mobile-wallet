import { useState, useEffect, Fragment } from "react";
import { View, Alert, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { useAppStore } from "@/hooks/useAppStore";
import { PinAuthenticator } from "@/features/Auth/components/PinAuthenticator";
import { PUBLIC_PIN_LENGTH } from "@/types/constants";
import { Button } from "@/components/Button";
import { getHardwareAuth } from "@/utils/sec/getHardwareAuth";
import { generateHash } from "@/utils/sec/generateHash";
import { savePin } from "@/utils/sec/handlePin";

enum Steps {
  enter,
  verify,
}

const initialValues = [...new Array(PUBLIC_PIN_LENGTH)];

export const EnrollAuthScreen = () => {
  const { t } = useTranslation();
  const { authMethod, setAuthMethod, setIsAuthEnrolled } = useAppStore();

  const [step, setStep] = useState(Steps.enter);

  const [firstStepvalues, setFirstStepValues] =
    useState<string[]>(initialValues);

  const [verificationValues, setVerificationValues] =
    useState<string[]>(initialValues);
  const resetVerificationValues = () => setVerificationValues(initialValues);

  const [verificationError, setVerificationError] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const handleOnChangeFirstStepValues = (values: string[], submit: boolean) => {
    setFirstStepValues(values);

    if (submit) setStep(Steps.verify);
  };

  const handleOnChangeVerificationValues = (
    values: string[],
    submit: boolean
  ) => {
    setVerificationValues(values);

    if (submit) {
      const formatedFirstStepValues = firstStepvalues.join("");
      const formatedVerificationValues = values.join("");

      const isValidPin = formatedFirstStepValues === formatedVerificationValues;

      setVerificationSuccess(isValidPin);
      setVerificationError(!isValidPin);
    }
  };

  const resetProgress = () => {
    setFirstStepValues(initialValues);
    setVerificationValues(initialValues);
    setVerificationError(false);
    setVerificationSuccess(false);
    setStep(Steps.enter);
  };

  const askHardwareAuthPermission = () => {
    const goToWizard = () => {
      setTimeout(() => {
        setIsAuthEnrolled(true);
        router.replace("/account-wizard/");
      }, 2700); // Timeout is assigned because of ringtone duration
    };

    if (authMethod === "BIOMETRIC") {
      Alert.alert(
        `${t("auth.askHardwareAuthTitle")} 🔐`,
        t(
          Platform.OS === "android"
            ? "auth.androidAskHardwareAuthDescription"
            : "auth.iOSAskHardwareAuthDescription"
        ),
        [
          {
            text: t("no"),
            onPress: () => {
              setAuthMethod("PIN");
              goToWizard();
            },
            style: "destructive",
          },
          { text: t("auth.acceptHardwareAuth"), onPress: goToWizard },
        ]
      );
    } else {
      goToWizard();
    }
  };

  const onSuccess = async () => {
    const pin = verificationValues.join("");
    const securedPIN = await generateHash(pin).then((data) => data);

    if (securedPIN) {
      const { key, salt } = securedPIN;

      await savePin(key, salt).then(() => {
        askHardwareAuthPermission();
      });
    }
  };

  useEffect(() => {
    (async () => {
      const { canUseHardwareAuth } = await getHardwareAuth();
      setAuthMethod(canUseHardwareAuth ? "BIOMETRIC" : "PIN");
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (verificationSuccess && !verificationError) {
        await onSuccess();
      }
    })();
  }, [verificationSuccess, verificationError]);

  return (
    <View className="flex-1 flex flex-col items-center justify-center">
      {step === Steps.enter && (
        <PinAuthenticator
          label={t("auth.enrollPassCodeTitle")}
          complementaryLabel={t("auth.enrollPassCodeDescription")}
          errorLabel=""
          successLabel=""
          error={false}
          success={false}
          length={PUBLIC_PIN_LENGTH}
          value={firstStepvalues}
          onChange={handleOnChangeFirstStepValues}
          onReset={() => {}}
        />
      )}

      {step === Steps.verify && (
        <Fragment>
          {!verificationSuccess && (
            <View className="flex justify-center items-center">
              <Button
                type="secondary"
                title={t("auth.goBack")}
                pressableProps={{ onPress: resetProgress }}
                wide
              />
            </View>
          )}

          <PinAuthenticator
            label={t("auth.enterPassCodeAgain")}
            complementaryLabel={t("auth.verifyPassCode")}
            errorLabel={t("auth.verifyIncorrectPassCode")}
            successLabel={`${t("auth.verifyLoadingWait")} 🔒`}
            error={verificationError}
            success={verificationSuccess}
            length={PUBLIC_PIN_LENGTH}
            value={verificationValues}
            onChange={handleOnChangeVerificationValues}
            onReset={resetVerificationValues}
          />
        </Fragment>
      )}
    </View>
  );
};
