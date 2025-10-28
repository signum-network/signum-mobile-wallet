import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import type { BarcodeScanningResult } from "expo-camera";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { CameraDialog } from "@/components/CameraDialog";
import type { TransactionCreation } from "../../utils/types";
import { ResolvedAccountCard } from "../../components/ResolvedAccountCard";
import { RecipientAutocomplete } from "../../components/RecipientAutocomplete";

export const Recipient = () => {
  const { t } = useTranslation();
  const { control, setValue } = useFormContext<TransactionCreation>();

  const onCodeScanned = (data: BarcodeScanningResult) => {
    setValue("recipient", data.data, { shouldValidate: true, shouldDirty: true });
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

        <RecipientAutocomplete
          control={control}
          name="recipient"
          placeholder={t("example") + " S-5MS6..., 167552..."}
          size="large"
        />

        <ResolvedAccountCard />
      </Card>

      <CameraDialog expected={"address"} onCodeScanned={onCodeScanned} />
    </View>
  );
};
