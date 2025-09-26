import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PUBLIC_CURRENT_OS } from "@/types/constants";
import { Button, type Props as ButtonProps } from "../Button";

const DEFAULT_HEIGHT = 82;

interface Props extends ButtonProps {
  hidden?: boolean;
  bottomOffset?: number;
}

export const FormNavButton = ({ hidden, bottomOffset, ...props }: Props) => {
  const { bottom } = useSafeAreaInsets();

  if (hidden) return null;

  return (
    <View
      style={{
        height: DEFAULT_HEIGHT,
        zIndex: 250,
        position: "absolute",
        left: 0,
        bottom: bottomOffset ?? bottom,
        elevation: PUBLIC_CURRENT_OS === "android" ? 50 : 0,
      }}
      className="justify-center items-center flex-1 w-full px-4 px-2 bg-card-foreground dark:bg-card-foreground-dark border-t border-card-border dark:border-card-border-dark"
    >
      <Button {...props} extraClassNames="max-w-sm" size="large" fullWidth />
    </View>
  );
};
