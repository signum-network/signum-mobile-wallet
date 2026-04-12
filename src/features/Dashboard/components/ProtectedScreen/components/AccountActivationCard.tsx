import { View, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import { useLedgerService } from "@/hooks/useLedgerService";
import { useWalletAccount } from "@/hooks/useWalletAccount";
import { useAccountStore } from "@/hooks/useAccountStore";
import { useNodeHostStore } from "@/hooks/useNodeHostStore";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { asRSAddress } from "@/utils/account/asRSAddress";
import { PUBLIC_SIGNUM_AVERAGE_BLOCK_TIME_IN_MINUTES } from "@/types/constants";
import Ionicons from "@expo/vector-icons/Ionicons";

export const AccountActivationCard = () => {
  const { t } = useTranslation();
  const { ledgerService } = useLedgerService();
  const { theme } = useAppTheme();
  const {
    walletName,
    accountId,
    publicKey,
    accountData: { loading, activationInProgress },
  } = useWalletAccount();
  const { updateAccountPublicKeyActivationStatus } = useAccountStore();
  const { currentNetwork } = useNodeHostStore();

  const requestActivation = async () => {
    if (!ledgerService) return;

    updateAccountPublicKeyActivationStatus(publicKey, currentNetwork, true);

    try {
      alert(
        `${t("unsafeAccount.activating")}\n` +
          t("unsafeAccount.accountActivationIsPending", {
            blocktime: PUBLIC_SIGNUM_AVERAGE_BLOCK_TIME_IN_MINUTES,
          })
      );
    } catch (err: any) {
      updateAccountPublicKeyActivationStatus(publicKey, currentNetwork, false);
      const msg = err?.message ?? "unknownError";
      console.warn("Activation failed:", err);

      alert(
        t("errors.activationFailed", {
          reason: msg,
        })
      );
    }
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
                name="information-circle"
                size={22}
                color={theme.colors.primary}
              />

              <Text size="large" className="font-medium" color="primary">
                {t(
                  !activationInProgress
                    ? "unsafeAccount.title"
                    : "unsafeAccount.activating"
                )}
              </Text>
            </View>

            {!activationInProgress && (
              <Text color="muted" size="large" className="text-center">
                {t("unsafeAccount.description")}
              </Text>
            )}

            <View className="w-full flex items-center justify-center flex-col gap-4 mt-4">
              {!activationInProgress ? (
                <Button
                  icon={<Ionicons name="lock-closed" size={24} color="white" />}
                  type="primary"
                  title={t("unsafeAccount.activate")}
                  fullWidth
                  disabled={activationInProgress}
                  pressableProps={{ onPress: requestActivation }}
                />
              ) : (
                <Text className="text-center">
                  {t("unsafeAccount.accountActivationIsPending", {
                    blocktime: PUBLIC_SIGNUM_AVERAGE_BLOCK_TIME_IN_MINUTES,
                  })}
                </Text>
              )}

              <Button
                title={t("unsafeAccount.visitAccountManager")}
                type="secondary"
                size="small"
                fullWidth
                linkProps={{ href: "/dashboard/account" }}
              />
            </View>
          </View>
        </Card>
      )}
    </View>
  );
};
