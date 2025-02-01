import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useFormContext, Controller } from "react-hook-form";
import type { BarcodeScanningResult } from "expo-camera";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { TextInput } from "@/components/TextInput";
import { CameraDialog } from "@/components/CameraDialog";
import type { TransactionCreation } from "../../utils/types";
import { ResolvedAccountCard } from "../../components/ResolvedAccountCard";

export const Recipient = () => {
  const { t } = useTranslation();
  const { control, setValue } = useFormContext<TransactionCreation>();

  const onCodeScanned = (data: BarcodeScanningResult) => {
    setValue("recipient", data.data);
  };

  return (
    <View className="gap-4 w-full">
      <Card>
        <View>
          <Text size="large" className="font-medium">
            {t("recipient")}
          </Text>

          <Text size="large" color="muted" className="font-medium">
            {t("transfer.recipientDescription")}
          </Text>
        </View>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder={t("example") + " S-5MS6..., 167552..."}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              size="large"
              extraClassNames="font-bold"
            />
          )}
          name="recipient"
        />

        <ResolvedAccountCard />
      </Card>

      <CameraDialog onCodeScanned={onCodeScanned} />
    </View>
  );
};
