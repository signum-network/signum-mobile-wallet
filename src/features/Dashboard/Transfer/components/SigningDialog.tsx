import { View, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import { Dialog } from "@/components/Dialog";
import { Text } from "@/components/Text";

interface Props {
  visible: boolean;
}

export const SigningDialog = ({ visible }: Props) => {
  const { t } = useTranslation();

  return (
    <Dialog variant="full" visible={visible}>
      <View className="flex flex-col items-center justify-center gap-2 w-full">
        <ActivityIndicator size={84} />

        <Text className="text-center" size="large">
          {t("transfer.signingTransactionTitle")}
        </Text>

        <Text className="text-center" color="muted">
          {t("transfer.signingTransactionDescription")} ❤️
        </Text>
      </View>
    </Dialog>
  );
};
