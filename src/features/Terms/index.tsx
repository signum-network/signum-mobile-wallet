import { Text, View } from "react-native";
import { LICENSE } from "./License";
import { useState } from "react";
import { Button } from "@/components/Button";
import { useTranslation } from "react-i18next";
import { Image } from "expo-image";
import { signumWhiteSymbolPicture } from "@/assets";

import Markdown from "react-native-marked";
import Checkbox from "expo-checkbox";

export const TermsScreen = () => {
  const { t } = useTranslation();
  const [accepted, setAccepted] = useState(false);

  return (
    <View className="flex-1 bg-white gap-4">
      <View className="items-center justify-center bg-signum pt-8 pb-4 gap-4">
        <Image
          source={{ uri: signumWhiteSymbolPicture }}
          style={{ width: 96, height: 96 }}
        />

        <Text className="color-white font-bold text-3xl">{t("welcome")}</Text>
      </View>

      <View style={{ flex: 1 }} className="px-2">
        <View>
          <Text>
            Welcome to the ultimate Signum mobile wallet. Before you can start
            using this wallet, you must accept the terms of use
          </Text>
        </View>
        <Markdown value={LICENSE} />
        <View className="flex-row items-center py-4">
          <Checkbox
            style={{
              marginRight: 4,
            }}
            value={accepted}
            onValueChange={setAccepted}
          />
          <Text onPress={() => setAccepted(!accepted)}>
            I accept the Terms of Service
          </Text>
        </View>
      </View>

      <Button type="primary" title="Get started" />
    </View>
  );
};
