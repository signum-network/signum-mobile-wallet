import {
  View,
  Pressable,
  ViewStyle,
  BackHandler,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text } from "@/components/Text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback } from "react";

type AppHeaderProps = {
  title: string;
  onBack?: () => void;
  disabled?: boolean;
};

export const AppHeader = ({ title, onBack, disabled }: AppHeaderProps) => {
  const { theme } = useAppTheme();
  const router = useRouter();

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
      return true;
    }
    if (router.canGoBack()) {
      router.back();
      return true;
    }
    return false;
  }, [onBack, router]);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== "android") return;
      const sub = BackHandler.addEventListener("hardwareBackPress", handleBack);
      return () => sub.remove();
    }, [handleBack])
  );

  return (
    <Pressable
      className="w-full active:opacity-80 ripple-[#333] ripple-bordered"
      onPress={handleBack}
      disabled={disabled}
    >
      <View className="w-full p-4 border-b border-gray-200 dark:border-gray-900">
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
          </View>
        </View>
      </View>
    </Pressable>
  );
};
