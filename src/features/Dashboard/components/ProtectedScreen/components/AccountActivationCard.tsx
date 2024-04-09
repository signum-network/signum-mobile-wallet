import { useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import Ionicons from "@expo/vector-icons/Ionicons";

export const AccountActivationCard = () => {
  const { t } = useTranslation();
  const { isTestnet } = useNodeHostStore();

  const [activationPending, setActivationPending] = useState(false);

  const requestActivation = async () => {};

  return (
    <View className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mx-auto">
      <Card>
        <View className="w-full flex flex-col items-center justify-center gap-2 px-4">
          <Ionicons name="alert-circle" size={50} color="#009688" />

          <Text size="large" className="font-medium">
            {t("unsafeAccount.title")}
          </Text>

          <Text color="muted" size="large" className="text-center">
            {t("unsafeAccount.description")}
          </Text>

          <Button
            icon={<Ionicons name="lock-closed" size={24} color="white" />}
            type="primary"
            title={t("unsafeAccount.activate")}
            wide
            extraClassNames="mt-4"
            pressableProps={{ onPress: requestActivation }}
          />
        </View>
      </Card>
    </View>
  );
};
