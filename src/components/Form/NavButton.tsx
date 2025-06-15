import { useEffect } from "react";
import { Keyboard } from "react-native";
import { PUBLIC_CURRENT_OS } from "@/types/constants";
import { Button, type Props as ButtonProps } from "../Button";
import Animated, { useSharedValue } from "react-native-reanimated";

const DEFAULT_HEIGHT = 95;

interface Props extends ButtonProps {
  hidden?: boolean;
}

export const FormNavButton = (props: Props) => {
  const height = useSharedValue(DEFAULT_HEIGHT);
  const display = useSharedValue<"none" | "flex">("flex");

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        height.set(0);
        display.set("none");
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        height.set(DEFAULT_HEIGHT);
        display.set("flex");
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
        // @ts-expect-error This is the proper usage of the useShareValue hook, there are type issues on react-native-reanimated, if you use display.value; You will get warnings of incorrect API usage
        display: props.hidden ? "none" : display,
        zIndex: 250,
        position: "absolute",
        left: 0,
        bottom: 0,
        elevation: PUBLIC_CURRENT_OS === "android" ? 50 : 0,
        height,
      }}
      className="flex justify-center items-center flex-1 w-full p-4 bg-card-foreground dark:bg-card-foreground-dark border-t border-card-border dark:border-card-border-dark"
    >
      <Button {...props} extraClassNames="max-w-sm" size="large" fullWidth />
    </Animated.View>
  );
};
