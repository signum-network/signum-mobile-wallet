import { useEffect } from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Easing,
  KeyboardState,
  useAnimatedKeyboard,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Options = {
  /** Extra offset at the top (e.g., header) */
  extraOffset?: number;
  /** iOS open/close duration in ms */
  iosDurations?: { open: number; close: number };
  /** Android open/close duration in ms */
  androidDurations?: { open: number; close: number };
  /** If false, first render snaps to target without animation */
  animateOnMount?: boolean;
};

export function useKeyboardPadding(opts: Options = {}) {
  const insets = useSafeAreaInsets();

  // Default durations feel close to the system keyboard
  const ios = opts.iosDurations ?? { open: 300, close: 300 };
  const and = opts.androidDurations ?? { open: 300, close: 300 };

  const kbd = useAnimatedKeyboard();
  const offset =
    (opts.extraOffset ?? 0) + (Platform.OS === "ios" ? insets.top + 12 : 0);

  // Correct initialization:
  // - animateOnMount === false => snap on first paint (hasMounted starts FALSE)
  // - animateOnMount !== false => animate immediately (hasMounted starts TRUE)
  const hasMounted = useSharedValue(
    opts.animateOnMount === false ? false : true
  );

  useEffect(() => {
    // After first commit, allow animations for subsequent updates
    hasMounted.value = true;
  }, [hasMounted]);

  // Animated style you can spread to any container
  const containerPadStyle = useAnimatedStyle(() => {
    // Desired bottom padding: keyboard height minus vertical offset
    const target = Math.max(0, (kbd.height.value ?? 0) - offset);

    const isOpeningOrOpen =
      kbd.state.value === KeyboardState.OPEN ||
      kbd.state.value === KeyboardState.OPENING;

    const duration =
      Platform.OS === "ios"
        ? isOpeningOrOpen
          ? ios.open
          : ios.close
        : isOpeningOrOpen
        ? and.open
        : and.close;

    // On first paint (when animateOnMount === false), snap without animation
    if (!hasMounted.value) {
      return { paddingBottom: target };
    }

    return {
      paddingBottom: withTiming(target, {
        duration,
        easing: Easing.out(Easing.cubic),
      }),
    };
  }, [offset, ios.open, ios.close, and.open, and.close]);

  return containerPadStyle;
}
