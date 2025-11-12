import { useEffect } from "react";
import { Keyboard, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import {
  Easing,
  useAnimatedKeyboard,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Options = {
  /** Fixed bottom spacing, e.g. for a sticky button/tab bar */
  baseBottom?: number;
  /** If false, first render snaps without animation */
  animateOnMount?: boolean;
  /** Animation duration when keyboard opens (ms) */
  openDuration?: number;
  /** Animation duration when keyboard closes (ms) */
  closeDuration?: number;
  /** Ignore very small "ghost" heights (e.g. stale values) */
  threshold?: number;
};

/**
 * Hook that returns an animated style with a bottom padding
 * that increases when the keyboard is visible.
 *
 * Combines reanimated’s useAnimatedKeyboard with real RN Keyboard events
 * and also uses keyboardDidHide to hard-reset padding.
 */
export function useKeyboardPadding({
  baseBottom = 0,
  animateOnMount = true,
  openDuration = 250,
  closeDuration = 200,
  threshold = 10,
}: Options = {}) {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const kbd = useAnimatedKeyboard();

  // Track real visibility from RN events (0 = hidden, 1 = visible)
  const visible = useSharedValue(0);

  // Shared value that holds the current paddingBottom
  const padding = useSharedValue(baseBottom);

  // Flag to avoid animation on the very first paint
  const mounted = useSharedValue(animateOnMount ? 1 : 0);

  useEffect(() => {
    const onShow = () => (visible.value = 1);
    const onWillHide = () => (visible.value = 0);
    const onDidHide = () => {
      // Hard reset padding on full hide
      padding.value = baseBottom;
    };

    const show =
      Platform.OS === "ios"
        ? Keyboard.addListener("keyboardWillShow", onShow)
        : Keyboard.addListener("keyboardDidShow", onShow);

    const willHide =
      Platform.OS === "ios"
        ? Keyboard.addListener("keyboardWillHide", onWillHide)
        : Keyboard.addListener("keyboardDidHide", onWillHide);

    const didHide = Keyboard.addListener("keyboardDidHide", onDidHide);

    return () => {
      show.remove();
      willHide.remove();
      didHide.remove();
      visible.value = 0;
      padding.value = baseBottom;
    };
  }, [baseBottom, visible, padding]);

  useEffect(() => {
    mounted.value = 1;
  }, [mounted]);

  const style = useAnimatedStyle(() => {
    const raw = kbd.height.value ?? 0;
    const safeBottom = insets.bottom;
    const height = Math.max(0, raw - safeBottom);

    const active = isFocused && visible.value === 1 && height > threshold;
    const target = baseBottom + (active ? height : 0);
    const duration = active ? openDuration : closeDuration;

    if (!mounted.value) {
      padding.value = target;
      return { paddingBottom: target };
    }

    padding.value = withTiming(target, {
      duration,
      easing: Easing.out(Easing.cubic),
    });

    return { paddingBottom: padding.value };
  }, [
    baseBottom,
    insets.bottom,
    isFocused,
    openDuration,
    closeDuration,
    threshold,
  ]);

  return style;
}
