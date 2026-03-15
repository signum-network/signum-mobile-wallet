import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, type ButtonProps as ButtonProps } from "../Button";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAccountStore } from "@/hooks/useAccountStore";
import { FORM_NAV_BUTTON_HEIGHT } from "@/theme/constants";


interface Props extends ButtonProps {
  hidden?: boolean;
}

export const FormNavButton = ({ hidden, ...props }: Props) => {
  const { bottom } = useSafeAreaInsets();
  const { tokens } = useAppTheme();
  const { isAccountEnrolled } = useAccountStore();

  if (hidden) return null;

  // When enrolled, the screen is inside the tab navigator which already
  // accounts for safe area insets — no extra bottom padding needed.
  const safeBottom = isAccountEnrolled ? 0 : bottom;

  return (
    <View
      style={{
        height: FORM_NAV_BUTTON_HEIGHT + safeBottom,
        paddingBottom: safeBottom,
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
