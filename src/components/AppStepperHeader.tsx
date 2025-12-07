import { View, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text } from "@/components/Text";
import { useAppTheme } from "@/hooks/useAppTheme";

type AppStepperHeaderProps = {
  title: string;
  currentStep: number;
  stepsAmount: number;
  onBack: () => void;
  disabled?: boolean;
};

export const AppStepperHeader = ({
  title,
  currentStep,
  stepsAmount,
  onBack,
  disabled,
}: AppStepperHeaderProps) => {
  const { tokens } = useAppTheme();

  return (
    <Pressable
      className="w-full active:opacity-80 ripple-[#333] ripple-bordered"
      onPress={onBack}
      disabled={disabled}
    >
      <View className="w-full px-4 py-2 border-b"
        style={{
          borderColor: tokens.border,
        }}
      >
        <View>
          <View className="w-full flex flex-row items-center justify-between">
            <Ionicons
              name="arrow-back"
              size={28}
              color={tokens.text}
              style={{ marginRight: 16 }}
            />
            <View className="flex-1 flex flex-col">
              <Text color="content" size="2large">
                {title}
              </Text>
            </View>
            <View className="w-14 h-14 rounded-full border flex justify-center items-center"
              style={{
                borderColor: tokens.border,
                backgroundColor: tokens.surfaceElevated,
              }}
            >
              <Text size="large" color="content" className="font-bold">
                {currentStep}/{stepsAmount}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
