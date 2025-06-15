import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { openTransactionLink } from "@/utils/explorer/openLink";
import { OperationType, type ManageCommitment } from "../utils/types";
import Ionicons from "@expo/vector-icons/Ionicons";

import * as Clipboard from "expo-clipboard";

interface Props {
  transactionId: string;
}

export const CompleteCard = ({ transactionId }: Props) => {
  const { t } = useTranslation();
  const { iconColor } = useAppTheme();
  const { watch } = useFormContext<ManageCommitment>();

  const type = watch("type");

  const copyTransactionId = async () => {
    await Clipboard.setStringAsync(transactionId);
    alert(t("overview.copiedTransactionId"));
  };

  const openTransactionInExplorer = () => openTransactionLink(transactionId);

  return (
    <Card>
      <View className="w-full flex flex-col items-center gap-1">
        <Ionicons name="checkmark-circle" size={65} color="green" />

        <Text fullWidth className="text-center" color="success" size="large">
          {t("transfer.signedTransactionTitle")}
        </Text>

        <Text fullWidth className="text-center">
          {t(
            type === OperationType.Add
              ? "commitment.addedCommitmentSuccessFeedback"
              : "commitment.removedCommitmentSuccessFeedback"
          )}
        </Text>

        <Text fullWidth className="text-center" color="muted">
          🚀 {t("transfer.signedTransactionDescription")}
        </Text>
      </View>

      {transactionId && (
        <View className="w-full flex flex-col items-center justify-center gap-4">
          <Button
            type="blackout"
            title={t("overview.copyTransactionId")}
            pressableProps={{ onPress: copyTransactionId }}
            size="small"
            icon={<Ionicons name="copy" size={18} color={iconColor.blackout} />}
            wide
          />

          <Button
            type="primary"
            title={t("overview.viewInExplorer")}
            pressableProps={{ onPress: openTransactionInExplorer }}
            size="small"
            icon={<Ionicons name="link" size={18} color="white" />}
            wide
          />
        </View>
      )}
    </Card>
  );
};
