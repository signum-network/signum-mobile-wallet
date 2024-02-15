import { Fragment, useState, useEffect } from "react";
import { Text } from "@/components/Text";
import { useAppStore } from "@/hooks/useAppStore";
import { PinAuthenticator } from "@/components/PinAuthenticator";
import { PUBLIC_PIN_LENGTH } from "@/types/constants";

export const AuthScreen = () => {
  const { authMethod } = useAppStore();
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [value, setValues] = useState<string[]>([
    ...new Array(PUBLIC_PIN_LENGTH),
  ]);

  useEffect(() => {
    console.log({ value });
  }, [value]);

  return (
    <Fragment>
      <Text>Auth Method: {authMethod}</Text>
      <PinAuthenticator
        length={PUBLIC_PIN_LENGTH}
        disabled={false}
        onChange={setValues}
        value={value}
      />
    </Fragment>
  );
};
