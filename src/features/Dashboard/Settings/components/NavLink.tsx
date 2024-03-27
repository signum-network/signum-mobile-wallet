import type { ReactNode } from "react";
import { Link } from "expo-router";
import { Pressable, View } from "react-native";
import { Text } from "@/components/Text";

interface Props {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
}

export const NavLink = ({ icon, title, description, href }: Props) => (
  // @ts-expect-error Routes are statically typed
  <Link href={href} asChild>
    <Pressable className="flex flex-row justify-start items-center px-4 py-4 rounded-lg w-full">
      <View className="mr-4">{icon}</View>

      <View className="flex flex-col gap-1 flex-1 ">
        <Text className="font-medium w-full">{title}</Text>
        <Text color="muted">{description}</Text>
      </View>
    </Pressable>
  </Link>
);
