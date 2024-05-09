import { Text, View } from "react-native";
import { ProtectedScreen } from "@/features/Dashboard/components/ProtectedScreen";

export default function Screen() {
  return (
    <ProtectedScreen>
      <View className="flex flex-1 justify-center items-center h-full">
        <Text className="text-4xl font-bold">🚧⌛</Text>
        <Text className="text-xl font-bold">Tokens will come soon</Text>
      </View>
    </ProtectedScreen>
  );
}
