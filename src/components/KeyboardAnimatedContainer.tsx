import type { PropsWithChildren } from "react";
import type { ViewProps } from "react-native";
import Animated from "react-native-reanimated";
import { useKeyboardPadding } from "@/hooks/useKeyboardPadding";

type Props = PropsWithChildren<
  ViewProps & {
    /** Set true on screens without bottom tab bar, e.g. onboarding account-wizard */
    noTabBar?: boolean;
    /** Set true on screens without bottom form navigation button */
    noFormNavButton?: boolean;
    /** Optional small manual correction */
    extraOffset?: number;
    /** If false, first render snaps without animation */
    animateOnMount?: boolean;
    /** Animation duration when keyboard opens */
    openDuration?: number;
    /** Animation duration when keyboard closes */
    closeDuration?: number;
    /** Ignore tiny ghost keyboard heights */
    threshold?: number;
  }
>;

export function KeyboardAnimatedContainer({
  children,
  style,
  noTabBar = false,
  noFormNavButton = false,
  extraOffset = 0,
  animateOnMount = true,
  openDuration = 250,
  closeDuration = 200,
  threshold = 10,
  ...rest
}: Props) {
  const animatedPaddingStyle = useKeyboardPadding({
    noTabBar,
    noFormNavButton,
    extraOffset,
    animateOnMount,
    openDuration,
    closeDuration,
    threshold,
  });

  return (
    <Animated.View style={[{ flex: 1 }, animatedPaddingStyle, style]} {...rest}>
      {children}
    </Animated.View>
  );
}