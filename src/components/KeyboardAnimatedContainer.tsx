import type { PropsWithChildren } from "react";
import type { ViewProps } from "react-native";
import Animated from "react-native-reanimated";
import { useKeyboardPadding } from "@/hooks/useKeyboardPadding";

type Props = PropsWithChildren<
  ViewProps & {
    /** Fixed bottom space (e.g., sticky button / tab bar height) */
    baseBottom?: number;
    /** If false, first render snaps to target without animation */
    animateOnMount?: boolean;
  }
>;

export function KeyboardAnimatedContainer({
  children,
  style,
  baseBottom = 0,
  animateOnMount = true,
  ...rest
}: Props) {
  const pad = useKeyboardPadding({ baseBottom, animateOnMount });
  return (
    <Animated.View
      style={[{ flex: 1 }, pad, style]}
      {...rest}
    >
      {children}
    </Animated.View>
  );
}
