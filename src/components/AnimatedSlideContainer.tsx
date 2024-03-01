import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import type { ChildrenProps } from "@/types/childrenProps";

export const AnimatedSlideContainer = ({ children }: ChildrenProps) => (
  <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
    {children}
  </Animated.View>
);
