import { KeyboardAvoidingView as NativeKeyboardAvoidingView } from "react-native";
import { PUBLIC_CURRENT_OS } from "@/types/constants";
import type { ChildrenProps } from "@/types/childrenProps";

// Android default behavior for Scrolling on Fields above keyboard is fine
// iOS needs some tweaks for preventing fields to be shown behind the keyboard

export const KeyboardAvoidingView = ({ children }: ChildrenProps) => {
  if (PUBLIC_CURRENT_OS === "android") return children;

  return (
    <NativeKeyboardAvoidingView behavior="padding" keyboardVerticalOffset={75}>
      {children}
    </NativeKeyboardAvoidingView>
  );
};
