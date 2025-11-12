import React, { useEffect, useMemo } from "react";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { ViewStyle, StyleProp } from "react-native";
import clsx from "clsx";

type Props = {
  /** Enable or disable the animation */
  active?: boolean;
  /** Duration while fully visible (ms) */
  visibleMs?: number;
  /** Fade-out duration (ms) */
  fadeOutMs?: number;
  /** Duration while mostly hidden (ms) */
  hiddenMs?: number;
  /** Fade-in duration (ms) */
  fadeInMs?: number;
  /** Minimum opacity during the "hidden" phase */
  minOpacity?: number;
  /** Optional wrapper styles */
  style?: StyleProp<ViewStyle>;
  /** Optional Tailwind/clsx classes */
  className?: string;
  /** Child components to animate */
  children: React.ReactNode;
};

export const Pulse: React.FC<Props> = ({
  active = true,
  visibleMs = 1400,
  fadeOutMs = 220,
  hiddenMs = 140,
  fadeInMs = 220,
  minOpacity = 0.2,
  style,
  className,
  children,
}) => {
  // Smooth easing curve for fade in/out transitions
  const easing = useMemo(() => Easing.bezier(0.4, 0.0, 0.2, 1), []);

  // Shared opacity value for animation
  const opacity = useSharedValue(1);

  // Start or stop animation depending on `active`
  useEffect(() => {
    if (!active) {
      opacity.value = 1;
      return;
    }

    // Sequence: visible → fade out → stay dim → fade in → repeat
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: visibleMs, easing }),
        withTiming(minOpacity, { duration: fadeOutMs, easing }),
        withTiming(minOpacity, { duration: hiddenMs, easing }),
        withTiming(1, { duration: fadeInMs, easing })
      ),
      -1, // infinite repeat
      false
    );
  }, [active, visibleMs, fadeOutMs, hiddenMs, fadeInMs, minOpacity]);

  // Bind opacity to animated style
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[animatedStyle, style]} className={clsx(className)}>
      {children}
    </Animated.View>
  );
};
