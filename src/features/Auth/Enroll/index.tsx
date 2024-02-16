import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/hooks/useAppStore";
import { PinAuthenticator } from "@/features/Auth/components/PinAuthenticator";
import { PUBLIC_PIN_LENGTH } from "@/types/constants";

enum Steps {
  enter,
  verify,
}

const initialValues = [...new Array(PUBLIC_PIN_LENGTH)];

export const EnrollAuthScreen = () => {
  const { t } = useTranslation();
  const { authMethod } = useAppStore();

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
      setVerificationError(!isValidPin ? true : false);

      if (isValidPin) onSuccess();
    }
  };

  const onSuccess = () => {
    console.log("Success");
  };

  return (
    <Fragment>
      {step === Steps.enter && (
        <PinAuthenticator
          label="Please set a passcode to secure your device"
          complementaryLabel="A passcode is used to protect the wallet"
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
        <PinAuthenticator
          label="Enter passcode again"
          complementaryLabel="Verify the passcode"
          errorLabel="Incorrect passcode, Please try again"
          successLabel="Congratulations ✅"
          error={verificationError}
          success={verificationSuccess}
          length={PUBLIC_PIN_LENGTH}
          value={verificationValues}
          onChange={handleOnChangeVerificationValues}
          onReset={resetVerificationValues}
        />
      )}
    </Fragment>
  );
};
