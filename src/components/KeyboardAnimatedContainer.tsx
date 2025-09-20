import type { PropsWithChildren } from "react";
import type { ViewProps } from "react-native";
import Animated from "react-native-reanimated";
import { useKeyboardPadding } from "@/hooks/useKeyboardPadding";

type Props = PropsWithChildren<
  ViewProps & {
    /** Extra vertical offset (e.g., sticky header height) */
    extraOffset?: number;
    /** If false, first render snaps to target without animation */
    animateOnMount?: boolean;
  }
>;

export function KeyboardAnimatedContainer({
  children,
  style,
  extraOffset = 0,
  animateOnMount = true,
  ...rest
}: Props) {
  const pad = useKeyboardPadding({ extraOffset, animateOnMount });
  return (
    <Animated.View style={[{ flex: 1 }, pad, style]} {...rest}>
      {children}
    </Animated.View>
  );
}
