import { CustomButton } from "@/components/action/Button";
import { MaterialIcons } from "@expo/vector-icons";
import { Address } from "@signumjs/core";
import { generateMasterKeys } from "@signumjs/crypto";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";

const ImportAccount = () => {
  const [passphrase, setPassphrase] = useState("");
  const [walletName, setWalletName] = useState("");

  const createActiveAccount = () => {
    const keys = generateMasterKeys(passphrase);
    const address = Address.fromPublicKey(keys.publicKey);
    Alert.alert(
      "This is your account",
      `${address.getReedSolomonAddress()} ${keys.publicKey}`
    );
  };

  return (
    <View className="px-8">
      <Stack.Screen
        options={{
          title: "Import Account",
          headerShown: true,
        }}
      />
      <View className="items-center">
        <Text>Choose the type of account</Text>
        <Text>Fancy button here</Text>
      </View>
      <View>
        <Text>Enter your passphrase</Text>
        <TextInput value={passphrase} onChangeText={setPassphrase} />
      </View>
      <View>
        <Text>Wallet Name</Text>
        <TextInput value={walletName} onChangeText={setWalletName} />
      </View>
      <View className="gap-4">
        <CustomButton
          type="primary"
          title="Restore wallet"
          icon={<MaterialIcons name="check-circle" size={24} color="white" />}
          pressableProps={{
            onPress: () => createActiveAccount(),
          }}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

export default ImportAccount;
