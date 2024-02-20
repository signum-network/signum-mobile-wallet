import { useState } from "react";
import { Text } from "@/components/Text";
import { useAppStore } from "@/hooks/useAppStore";
import { PinAuthenticator } from "@/features/Auth/components/PinAuthenticator";
import { PUBLIC_PIN_LENGTH } from "@/types/constants";

const initialValues = [...new Array(PUBLIC_PIN_LENGTH)];

export const LoginAuthScreen = () => {
  const { authMethod } = useAppStore();

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [value, setValues] = useState<string[]>(initialValues);

  const resetValues = () => setValues(initialValues);

  const handleOnChangeValues = (values: string[], submit: boolean) => {
    setValues(values);

    if (submit) {
      const formatedValues = values.join("");
      const isValidPin = formatedValues === "2204";
      setSuccess(isValidPin);

      setError(!isValidPin ? true : false);

      if (isValidPin) onSuccess();
    }
  };

  const onSuccess = () => {
    console.log("Success");
  };

  return (
    <PinAuthenticator
      label="Please set a passcode to secure your device"
      complementaryLabel="A passcode is used to protect the wallet"
      errorLabel="Wrong PIN, Please try again"
      successLabel="Welcome back 😊"
      error={error}
      success={success}
      length={PUBLIC_PIN_LENGTH}
      value={value}
      onChange={handleOnChangeValues}
      onReset={resetValues}
    />
  );
};
