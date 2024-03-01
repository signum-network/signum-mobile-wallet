import { View } from "react-native";
import { Button, type Props as ButtonProps } from "./Button";

export const FormNavButton = (props: ButtonProps) => {
  return (
    <View className="flex justify-center items-center flex-1 w-full absolute bottom-0 z-[50] p-4">
      <Button {...props} extraClassNames="max-w-sm" size="large" fullWidth />
    </View>
  );
};
