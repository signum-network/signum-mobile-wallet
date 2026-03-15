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
import {
  TAB_BAR_BASE_HEIGHT,
  FORM_NAV_BUTTON_HEIGHT,
} from "@/theme/constants";

type Options = {
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
};

/**
 * Returns an animated style with bottom padding that grows when the keyboard opens.
 *
 * Calculation:
 * keyboard shift = keyboard height - already occupied bottom space
 *
 * Bottom space assumptions:
 * - Tab bar exists by default and already includes safe area bottom inset
 * - FormNavButton exists by default
 * - On screens without tab bar, safe area bottom is used instead
 */
export function useKeyboardPadding({
  noTabBar = false,
  noFormNavButton = false,
  extraOffset = 0,
  animateOnMount = true,
  openDuration = 250,
  closeDuration = 200,
  threshold = 10,
}: Options = {}) {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const keyboard = useAnimatedKeyboard();

  const visible = useSharedValue(0);
  const padding = useSharedValue(0);
  const mounted = useSharedValue(animateOnMount ? 1 : 0);

  useEffect(() => {
    const onShow = () => { visible.value = 1; };
    const onHide = () => { visible.value = 0; padding.value = 0; };

    const showSub =
      Platform.OS === "ios"
        ? Keyboard.addListener("keyboardWillShow", onShow)
        : Keyboard.addListener("keyboardDidShow", onShow);

    const hideSub =
      Platform.OS === "ios"
        ? Keyboard.addListener("keyboardWillHide", onHide)
        : Keyboard.addListener("keyboardDidHide", onHide);

    const didHideSub = Keyboard.addListener("keyboardDidHide", onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
      didHideSub.remove();
      visible.value = 0;
      padding.value = 0;
    };
  }, [padding, visible]);

  useEffect(() => {
    mounted.value = 1;
  }, [mounted]);

  const style = useAnimatedStyle(() => {
    const keyboardHeight = keyboard.height.value ?? 0;

    const tabBarHeight = noTabBar ? insets.bottom : TAB_BAR_BASE_HEIGHT + insets.bottom;
    const formNavHeight = noFormNavButton ? 0 : FORM_NAV_BUTTON_HEIGHT;

    const occupiedBottomSpace = tabBarHeight + formNavHeight;

    const isKeyboardVisible =
      isFocused && visible.value === 1 && keyboardHeight > threshold;

    const target = isKeyboardVisible
      ? Math.max(0, keyboardHeight - occupiedBottomSpace + extraOffset)
      : 0;

    const duration = isKeyboardVisible ? openDuration : closeDuration;

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
    closeDuration,
    extraOffset,
    insets.bottom,
    isFocused,
    noFormNavButton,
    noTabBar,
    openDuration,
    threshold,
  ]);

  return style;
}
