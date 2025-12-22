import { Fragment, useState, useCallback } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import {
  CameraView,
  useCameraPermissions,
  PermissionStatus,
  type BarcodeScanningResult,
} from "expo-camera";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Text } from "./Text";
import { Button } from "./Button";
import { Dialog } from "./Dialog";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import type {Address} from "@signumjs/core";
import {asAddress} from "@/utils/account/asAddress";

interface Props {
  onCodeScanned: (code: BarcodeScanningResult) => void;
  expected: "address" | "seed";
}

function getAddressFromScannedData(scannedData: string): Address | null {
    try{
        return asAddress(scannedData)
    }catch {
        return null
    }
}


export const CameraDialog = ({ onCodeScanned, expected }: Props) => {
  const { t } = useTranslation();
  const { iconColor } = useAppTheme();
  const [permission, requestPermission] = useCameraPermissions();

  const [visible, setVisible] = useState(false);
  const showDialog = () => {
    resetFeedback();
    setVisible(true);
  };
  const hideDialog = () => {
    setVisible(false);
    resetFeedback();
  };

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errorLock, setErrorLock] = useState(false);

  const showErrorText = useCallback(
    (msg: string) => {
      if (errorLock) return;
      setErrorMsg(msg);
      setErrorLock(true);
      setTimeout(() => {
        setErrorMsg(null);
        setErrorLock(false);
      }, 1500);
    },
    [errorLock]
  );

  const resetFeedback = useCallback(() => {
    setErrorMsg(null);
    setErrorLock(false);
  }, []);

  const request = async () => {
    const { canAskAgain, granted } = await requestPermission();
    if (!canAskAgain && !granted) alert(t("cameraPermissionRejected"));
  };

  const scanEvent = (code: BarcodeScanningResult) => {
    const scannedData = code.data?.trim();
    if (!scannedData) return;

    if (expected === "address") {
      const address = getAddressFromScannedData(scannedData);
      if (address) {
        onCodeScanned({ ...code, data: address.getReedSolomonAddress(true) });
        hideDialog();
      } else {
        showErrorText(t("invalidQRCode"));
      }
      return;
    }

    if (expected === "seed") {
        // seed can be any data, so we don't need to validate it
        onCodeScanned({ ...code, data: scannedData });
    }
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
            <View className="w-full h-96 mb-8 relative">
              <CameraView
                style={{ width: "100%", height: "100%" }}
                mute
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                onBarcodeScanned={scanEvent}
                facing="back"
              />
              {errorMsg ? (
                <View className="absolute bottom-[-30px] left-0 right-0">
                  <Text className="text-center font-medium" color="error">
                    {errorMsg}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : (
            <Fragment>
              <FontAwesome6
                name="camera"
                size={65}
                color={iconColor.default}
                className="opacity-50"
              />
              <Text className="text-center font-medium">
                {t("allowTheAppToUseTheCamera")} 🤖
              </Text>
              <Button
                icon={<FontAwesome6 name="qrcode" size={24} color="white" />}
                fullWidth
                title={t("requestCameraPermission")}
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
