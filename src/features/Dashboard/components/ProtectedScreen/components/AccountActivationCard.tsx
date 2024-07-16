import { useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import { useLedgerService } from "@/hooks/useLedgerService";
import { useAccount } from "@/hooks/useAccount";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { asRSAddress } from "@/utils/account/asRSAddress";
import Ionicons from "@expo/vector-icons/Ionicons";

export const AccountActivationCard = () => {
  const { t } = useTranslation();
  const { ledgerService } = useLedgerService();
  const { theme } = useAppTheme();
  const {
    walletName,
    accountId,
    publicKey,
    accountData: { loading },
  } = useAccount();

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
      {loading ? (
        <ActivityIndicator size={84} />
      ) : (
        <Card>
          <View className="w-full flex flex-col items-center justify-center gap-2 px-4">
            <View className="my-2 w-full">
              <Card>
                <View className="w-full flex items-center justify-center gap-1">
                  <Text className="font-medium">{walletName}</Text>
                  <Text color="muted">{asRSAddress(accountId)}</Text>
                </View>
              </Card>
            </View>

            <View className="w-full flex flex-row items-center justify-center gap-2">
              <Ionicons
                name="alert-circle"
                size={22}
                color={theme.colors.notification}
              />

              <Text size="large" className="font-medium" color="error">
                {t("unsafeAccount.title")}
              </Text>
            </View>

            <Text color="muted" size="large" className="text-center">
              {t("unsafeAccount.description")}
            </Text>

            <Button
              icon={<Ionicons name="lock-closed" size={24} color="white" />}
              type="secondary"
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
      )}
    </View>
  );
};
