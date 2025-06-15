import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { useAccount } from "@/hooks/useAccount";
import { asRSAddress } from "@/utils/account/asRSAddress";

import * as Clipboard from "expo-clipboard";
import QRCode from "react-qr-code";
import Ionicons from "@expo/vector-icons/Ionicons";

export const DepositScreen = () => {
  const { t } = useTranslation();
  const { accountId } = useAccount();
  const { iconColor } = useAppTheme();

  const rsAddress = `${asRSAddress(accountId)}`;

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(rsAddress);
    alert(t("deposit.copiedAddress"));
  };

  return (
    <View className="flex flex-1 flex-col items-center justify-center w-full px-4">
      <Card>
        <View className="flex flex-col items-center justify-center w-full gap-4 px-4">
          <Text size="large" className="font-medium">
            {t("deposit.title")}
          </Text>

          <QRCode
            size={150}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={accountId}
          />

          <Text size="large" className="font-bold">
            {rsAddress}
          </Text>

          <Button
            type="blackout"
            fullWidth
            size="large"
            icon={<Ionicons name="copy" size={24} color={iconColor.blackout} />}
            title={t("deposit.copy")}
            pressableProps={{ onPress: copyToClipboard }}
          />
        </View>
      </Card>
    </View>
  );
};
