import { Fragment, useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import {
  CameraView,
  useCameraPermissions,
  PermissionStatus,
  type BarcodeScanningResult,
} from "expo-camera/next";
import { FontAwesome6 } from "@expo/vector-icons";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Text } from "./Text";
import { Button } from "./Button";
import { Dialog } from "./Dialog";

interface Props {
  onCodeScanned: (code: BarcodeScanningResult) => void;
}

export const CameraDialog = ({ onCodeScanned }: Props) => {
  const { t } = useTranslation();
  const { iconColor } = useAppTheme();
  const [permission, requestPermission] = useCameraPermissions();

  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const request = async () => {
    await requestPermission().catch(() => alert(t("permissionRejected")));
  };

  const scanEvent = (code: BarcodeScanningResult) => {
    onCodeScanned(code);
    hideDialog();
  };

  const canUseCamera =
    visible &&
    permission &&
    permission.granted &&
    permission.status === PermissionStatus.GRANTED;

  return (
    <Fragment>
      <Dialog variant="full" visible={visible} onClose={hideDialog}>
        <View className="flex flex-col items-center justify-center gap-4 w-full">
          <Text className="mb-8 font-bold">{t("scanQRCode")}</Text>

          {canUseCamera ? (
            <View className="w-full h-96 mb-8">
              <CameraView
                style={{ width: "100%", height: "100%" }}
                mute
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                onBarcodeScanned={scanEvent}
                facing="back"
              ></CameraView>
            </View>
          ) : (
            <Fragment>
              <FontAwesome6
                name="camera"
                size={65}
                color={iconColor.default}
                style={{ opacity: 0.5 }}
              />

              <Text className="text-center font-medium">
                {t("allowTheAppToUseTheCamera")} 🤖
              </Text>

              <Button
                icon={<FontAwesome6 name="qrcode" size={24} color="white" />}
                fullWidth
                title={t("requestCameraPermission")}
                disabled={!permission?.canAskAgain}
                type="primary"
                pressableProps={{ onPress: request }}
              />
            </Fragment>
          )}
        </View>

        <Button
          icon={<FontAwesome6 name="window-close" size={24} color="white" />}
          fullWidth
          title={t("cancel")}
          type="error"
          pressableProps={{ onPress: hideDialog }}
        />
      </Dialog>

      <Button
        icon={
          <FontAwesome6 name="qrcode" size={24} color={iconColor.blackout} />
        }
        type="blackout"
        title={t("scanQRCode")}
        fullWidth
        pressableProps={{ onPress: showDialog }}
      />
    </Fragment>
  );
};
