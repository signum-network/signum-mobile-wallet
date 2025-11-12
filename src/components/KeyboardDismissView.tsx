import { PropsWithChildren } from "react";
import {
  Keyboard,
  TouchableWithoutFeedback,
  View,
  Platform,
  KeyboardAvoidingView,
} from "react-native";

/**
* Wrapper component that closes the keyboard when you tap outside of it. 
* Ideal for wrapping entire screens or form areas. 
*/

export const KeyboardDismissView = ({ children }: PropsWithChildren) => {
  return (
    <KeyboardAvoidingView
      className="flex-1 w-full"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1 w-full">{children}</View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};