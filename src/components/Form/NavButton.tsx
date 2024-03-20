import { useEffect } from "react";
import { Keyboard, Platform } from "react-native";
import { Button, type Props as ButtonProps } from "../Button";
import Animated, { useSharedValue } from "react-native-reanimated";

const DEFAULT_HEIGHT = 81.4;

export const FormNavButton = (props: ButtonProps) => {
  const height = useSharedValue(DEFAULT_HEIGHT);
  const display = useSharedValue<"none" | "flex">("flex");

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        height.value = 0;
        display.value = "none";
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        height.value = DEFAULT_HEIGHT;
        display.value = "flex";
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <Animated.View
      style={{
        display,
        zIndex: 250,
        position: "absolute",
        left: 0,
        bottom: 0,
        elevation: Platform.OS === "android" ? 50 : 0,
        height,
      }}
      className="flex justify-center items-center flex-1 w-full p-4 bg-card-foreground dark:bg-card-foreground-dark border-t border-card-border dark:border-card-border-dark"
    >
      <Button {...props} extraClassNames="max-w-sm" size="large" fullWidth />
    </Animated.View>
  );
};
