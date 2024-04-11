import { useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useLedgerService } from "@/hooks/useLedgerService";
import { useAccount } from "@/hooks/useAccount";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

import Ionicons from "@expo/vector-icons/Ionicons";

export const AccountActivationCard = () => {
  const { t } = useTranslation();
  const { ledgerService } = useLedgerService();
  const { accountId, publicKey } = useAccount();

  const [activationPending, setActivationPending] = useState(false);

  const requestActivation = async () => {
    if (!ledgerService) return;

    await ledgerService.account
      .activate(accountId, publicKey)
      .then(() => alert(t("unsafeAccount.accountActivationIsPending")))
      .catch(() => alert(t("unsafeAccount.accountActivationIsPending")))
      .finally(() => setActivationPending(true));
  };

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
            title={t(
              activationPending
                ? "unsafeAccount.activating"
                : "unsafeAccount.activate"
            )}
            wide
            extraClassNames="mt-4"
            disabled={activationPending}
            pressableProps={{ onPress: requestActivation }}
          />
        </View>
      </Card>
    </View>
  );
};
