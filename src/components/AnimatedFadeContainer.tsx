import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import type { PropsWithChildren } from "react";

interface AnimatedFadeProps {
  inDuration?: number;
  outDuration?: number;
  fullWidth?: boolean;
}

export function AnimatedFadeContainer({
  children,
  inDuration = 200, //200
  outDuration = 100,  //100
  fullWidth = false,
}: PropsWithChildren<AnimatedFadeProps>) {
  return (
    <Animated.View
      exiting={FadeOut.duration(outDuration)}
      entering={FadeIn.duration(inDuration).delay(outDuration)}
      className={fullWidth ? "w-full" : undefined}
    >
      {children}
    </Animated.View>
  );
}
