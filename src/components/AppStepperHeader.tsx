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
  const { theme } = useAppTheme();

  return (
    <Pressable
      className="w-full active:opacity-80 ripple-[#333] ripple-bordered"
      onPress={onBack}
      disabled={disabled}
    >
      <View className="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-900">
        <View>
          <View className="w-full flex flex-row items-center justify-between">
            <Ionicons
              name="arrow-back"
              size={28}
              color={theme.colors.text}
              style={{ marginRight: 16 }}
            />
            <View className="flex-1 flex flex-col">
              <Text color="content" className="text-[22px]">
                {title}
              </Text>
            </View>
            <View className="w-14 h-14 rounded-full border border-card-border dark:border-card-border-dark flex justify-center items-center">
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
