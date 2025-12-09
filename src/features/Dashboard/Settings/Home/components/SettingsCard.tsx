import { Pressable, View } from "react-native";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { router, type Href } from "expo-router";
import { useAppTheme } from "@/hooks/useAppTheme";

type Props = {
  icon: React.ReactNode;
  title: string;
  description?: string;
  href: Href | string;
};

export const SettingsCard = ({ icon, title, description, href }: Props) => {
  const goTo = () => {
    router.push(href as Href);
  };

  const { iconColor } = useAppTheme();

  return (
    <Pressable
      onPress={goTo}
      className="w-full rounded-lg active:opacity-80 ripple-[#333] ripple-bordered"
    >
      <Card>
        <View className="w-full h-20 flex flex-row items-center justify-between">
          <View className="flex flex-row items-center gap-3 flex-1 pr-2">
            <View className="pl-2">{icon}</View>

            <View className="flex-1 px-4">
              <Text className="font-medium" size="large">
                {title}
              </Text>
              {!!description && (
                <Text color="muted" size="small" className="mt-0.5">
                  {description}
                </Text>
              )}
            </View>
          </View>
          <View className="px-3 py-2">
            <Ionicons
              name="chevron-forward"
              size={20}
              color={iconColor.default}
            />
          </View>
        </View>
      </Card>
    </Pressable>
  );
};
