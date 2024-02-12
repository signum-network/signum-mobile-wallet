import { Button } from "@/components/Button";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

const WalletCreateSelection = () => {
  return (
    <View className="px-8">
      <View className="items-center p-16">
        <Text>Logo</Text>
        <Text className="color-white text-xl">Signum Mobile Wallet</Text>
        <Text>
          Set up your account to send and receive money using this awesome
          wallet!
        </Text>
      </View>
      <View>
        <Text className="text-sm color-gray-500">
          Please select if you want to create or restore your account
        </Text>
      </View>
      <View className="gap-4">
        <Button type="primary" title="Create a new wallet" />
        <Button type="secondary" title="I already have one" />
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

export default WalletCreateSelection;
