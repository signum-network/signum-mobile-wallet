import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PUBLIC_CURRENT_OS } from "@/types/constants";
import { Button, type Props as ButtonProps } from "../Button";
import { useAppTheme } from "@/hooks/useAppTheme";

const DEFAULT_HEIGHT = 78;

interface Props extends ButtonProps {
  hidden?: boolean;
  bottomOffset?: number;
}

export const FormNavButton = ({ hidden, bottomOffset, ...props }: Props) => {
  const { bottom } = useSafeAreaInsets();
  const { tokens } = useAppTheme();

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
        backgroundColor: tokens.background,
        borderTopWidth: 1,
        borderColor: tokens.border,
      }}
      className="flex flex-row justify-around items-center w-full px-4 gap-2"
    >
      <Button {...props} extraClassNames="max-w-sm" size="large" fullWidth />
    </View>
  );
};
