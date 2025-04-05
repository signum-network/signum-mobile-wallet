import { useEffect } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useFormContext, Controller } from "react-hook-form";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { FormCheckbox } from "@/components/Form/Checkbox";
import { TextInput } from "@/components/TextInput";
import { type TransactionCreation, maxMemoLength } from "../../utils/types";

export const MemoOptions = () => {
  const { t } = useTranslation();
  const { watch, setValue, control } = useFormContext<TransactionCreation>();

  const memo = watch("memo");
  const includeMemo = watch("includeMemo");
  const isMemoEncrypted = watch("isMemoEncrypted");

  const toggleMemoAvailability = () => {
    setValue("includeMemo", !includeMemo);
    setValue("isMemoEncrypted", false);
    setValue("memo", "");
  };

  const toggleEncryptedMemoAvailability = () => {
    setValue("isMemoEncrypted", !isMemoEncrypted);
  };

  useEffect(() => {
    setValue("fee", "");
  }, [memo, includeMemo, isMemoEncrypted]);

  return (
    <View className="gap-4 w-full">
      <FormCheckbox
        value={includeMemo}
        onPress={toggleMemoAvailability}
        title={t("transfer.addMemoTitle")}
        description={t("transfer.addMemoDescription")}
        fullWidth
        bordered
      />

      {includeMemo && (
        <>
          <Card>
            <View>
              <Text size="large" className="font-medium">
                {t("transfer.addMemoHint")}
              </Text>
            </View>

            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  extraClassNames="font-medium w-full min-h-40"
                  size="large"
                  maxLength={maxMemoLength}
                  multiline
                  textAlignVertical="top"
                />
              )}
              name="memo"
            />

            <Text
              color={memo.length > maxMemoLength ? "error" : "muted"}
              className="self-end"
            >
              {`${memo.length}/${maxMemoLength}`}
            </Text>
          </Card>

          <FormCheckbox
            value={isMemoEncrypted}
            onPress={toggleEncryptedMemoAvailability}
            title={"🔐 " + t("transfer.addEncryptedMemoTitle")}
            description={t("transfer.addEncryptedMemoDescription")}
            fullWidth
            bordered
          />
        </>
      )}
    </View>
  );
};
